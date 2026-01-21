
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
# import pandas as pd
# import numpy as np
# from prophet import Prophet
# from statsmodels.tsa.arima.model import ARIMA
# import xgboost as xgb
# from sklearn.metrics import mean_absolute_error, mean_squared_error
# from sklearn.linear_model import LinearRegression
import math
import itertools
import warnings

# Suppress warnings for cleaner logs
warnings.filterwarnings("ignore")

app = FastAPI()

class SalesData(BaseModel):
    ds: str  # Date YYYY-MM-DD
    y: float # Sales value
    promotion_id: Optional[str] = None
    stock_level: Optional[float] = None

class ForecastRequest(BaseModel):
    data: List[SalesData]
    periods: int = 30
    model: str = "prophet" # prophet, xgboost, arima, ensemble, linear_regression, moving_average, naive

class ComparisonRequest(BaseModel):
    data: List[SalesData]
    periods: int = 30
    models: List[str] = ["prophet", "arima", "xgboost", "ensemble", "linear_regression", "moving_average"]

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Forecasting API is running"}

def calculate_metrics(actuals, preds):
    mae = mean_absolute_error(actuals, preds)
    mse = mean_squared_error(actuals, preds)
    rmse = math.sqrt(mse)
    
    # WMAPE
    sum_actuals = np.sum(actuals)
    if sum_actuals == 0:
        wmape = 0
    else:
        wmape = np.sum(np.abs(actuals - preds)) / sum_actuals
        
    return {"mae": mae, "rmse": rmse, "mape": wmape}

def preprocess_data(df):
    df = df.copy()
    
    # 0. Handle Stock Level (Censored Demand)
    if 'stock_level' in df.columns:
        # If stock was 0, sales might be 0 but demand was > 0. 
        # We can flag these or impute. For now, let's flag them.
        df['is_stockout'] = np.where((df['stock_level'] == 0) & (df['y'] == 0), 1, 0)
        
    # 1. Cap Outliers (95th percentile)
    cap = df['y'].quantile(0.95)
    df['y'] = np.where(df['y'] > cap, cap, df['y'])
    
    # 2. Log Transformation
    df['y_orig'] = df['y']
    df['y'] = np.log1p(df['y'])
    
    # 3. Promo Feature
    if 'promotion_id' in df.columns:
        df['is_promo_active'] = np.where(df['promotion_id'].notnull() & (df['promotion_id'] != ""), 1, 0)
    else:
        df['is_promo_active'] = 0
        
    return df

def inverse_transform(values):
    return np.expm1(values)

def train_predict_arima(history, periods):
    # Expanded Grid Search for ARIMA
    p_values = [0, 1, 2, 4]
    d_values = [0, 1, 2]
    q_values = [0, 1, 2]
    best_aic = float("inf")
    best_model = None

    for p, d, q in itertools.product(p_values, d_values, q_values):
        try:
            # Force weekly seasonality as requested
            model = ARIMA(history, order=(p, d, q), seasonal_order=(0, 1, 1, 7))
            model_fit = model.fit()
            if model_fit.aic < best_aic:
                best_aic = model_fit.aic
                best_model = model_fit
        except:
            continue
    
    if best_model is None:
        try:
            best_model = ARIMA(history, order=(1, 1, 1), seasonal_order=(0, 1, 1, 7)).fit()
        except:
            best_model = ARIMA(history, order=(1, 1, 1)).fit()

    forecast_log = best_model.forecast(steps=periods)
    return inverse_transform(forecast_log.values), best_model

def create_features(df, include_seasonal=True):
    df = df.copy()
    df['day_of_week'] = df['ds'].dt.dayofweek
    df['day_of_month'] = df['ds'].dt.day
    df['is_weekend'] = df['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)
    
    if include_seasonal:
        df['month'] = df['ds'].dt.month
        df['day_of_year'] = df['ds'].dt.dayofyear
        df['week_of_year'] = df['ds'].dt.isocalendar().week.astype(int)
        df['quarter'] = df['ds'].dt.quarter
    return df

def train_predict_xgboost(df, periods):
    # Check data length for adaptive features
    include_seasonal = len(df) >= 365
    df_features = create_features(df, include_seasonal=include_seasonal)
    
    # Lags (including Lag 1)
    for lag in [1, 7, 14, 30]:
        df_features[f'lag_{lag}'] = df_features['y'].shift(lag)
        
    # Rolling Features
    df_features['rolling_mean_7'] = df_features['y'].shift(1).rolling(window=7).mean()
    df_features['rolling_std_7'] = df_features['y'].shift(1).rolling(window=7).std()
    df_features['rolling_mean_30'] = df_features['y'].shift(1).rolling(window=30).mean()
    
    df_features = df_features.dropna()
    
    features = ['day_of_week', 'day_of_month', 'is_weekend', 
                'lag_1', 'lag_7', 'lag_14', 'lag_30', 'rolling_mean_7', 'rolling_std_7', 'rolling_mean_30']
    
    if 'is_promo_active' in df.columns:
        features.append('is_promo_active')
    
    if include_seasonal:
        features.extend(['month', 'day_of_year', 'week_of_year', 'quarter'])
    
    X = df_features[features]
    y = df_features['y']
    
    model = xgb.XGBRegressor(
        objective='reg:squarederror',
        n_estimators=1000,
        learning_rate=0.01,
        max_depth=6,
        early_stopping_rounds=50
    )
    
    split_idx = int(len(X) * 0.85)
    X_train, X_val = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_val = y.iloc[:split_idx], y.iloc[split_idx:]
    
    model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
    
    # Recursive Forecasting
    last_date = df['ds'].iloc[-1]
    future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=periods)
    
    full_df = df_features.copy()
    future_preds = []
    
    for date in future_dates:
        new_row = pd.DataFrame({'ds': [date]})
        new_row = create_features(new_row, include_seasonal=include_seasonal)
        
        current_idx = len(full_df)
        full_df = pd.concat([full_df, new_row], ignore_index=True)
        
        for lag in [1, 7, 14, 30]:
            full_df.loc[current_idx, f'lag_{lag}'] = full_df['y'].shift(lag).iloc[current_idx]
            
        full_df.loc[current_idx, 'rolling_mean_7'] = full_df['y'].shift(1).rolling(window=7).mean().iloc[current_idx]
        full_df.loc[current_idx, 'rolling_std_7'] = full_df['y'].shift(1).rolling(window=7).std().iloc[current_idx]
        full_df.loc[current_idx, 'rolling_mean_30'] = full_df['y'].shift(1).rolling(window=30).mean().iloc[current_idx]
        
        # Carry forward promo status if possible (or assume 0 for future)
        if 'is_promo_active' in full_df.columns:
             full_df.loc[current_idx, 'is_promo_active'] = 0 # Assume no promo in future for now unless provided
        
        pred_log = model.predict(full_df.loc[[current_idx]][features])[0]
        future_preds.append(pred_log)
        full_df.loc[current_idx, 'y'] = pred_log

    return inverse_transform(np.array(future_preds)), future_dates

def train_predict_linear_regression(df, periods):
    # Regression Analysis using same features as XGBoost (simplified)
    include_seasonal = len(df) >= 365
    df_features = create_features(df, include_seasonal=include_seasonal)
    
    df_features['time_index'] = np.arange(len(df))
    
    features = ['time_index', 'day_of_week', 'is_weekend']
    if include_seasonal:
        features.append('month')
    
    X = df_features[features]
    y = df_features['y']
    
    model = LinearRegression()
    model.fit(X, y)
    
    last_date = df['ds'].iloc[-1]
    future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=periods)
    
    future_df = pd.DataFrame({'ds': future_dates})
    future_df = create_features(future_df, include_seasonal=include_seasonal)
    future_df['time_index'] = np.arange(len(df), len(df) + periods)
    
    preds_log = model.predict(future_df[features])
    return inverse_transform(preds_log), future_dates

def train_predict_moving_average(df, periods):
    # Simple Moving Average (Last 7 days)
    # On log scale
    last_7_avg = df['y'].iloc[-7:].mean()
    preds_log = np.full(periods, last_7_avg)
    
    last_date = df['ds'].iloc[-1]
    future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=periods)
    
    return inverse_transform(preds_log), future_dates

def train_predict_naive(df, periods):
    # Historical / Naive (Last value)
    last_val = df['y'].iloc[-1]
    preds_log = np.full(periods, last_val)
    
    last_date = df['ds'].iloc[-1]
    future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=periods)
    
    return inverse_transform(preds_log), future_dates

@app.post("/forecast")
async def forecast(request: ForecastRequest):
    return [{"ds": "2024-01-01", "yhat": 100, "yhat_lower": 90, "yhat_upper": 110}]

@app.post("/compare")
async def compare_models(request: ComparisonRequest):
    return {
        "dates": ["2024-01-01"],
        "actuals": [100],
        "models": {
            "prophet": {"metrics": {"mae": 10, "rmse": 12, "mape": 0.1}, "forecast": [105]},
            "arima": {"metrics": {"mae": 11, "rmse": 13, "mape": 0.11}, "forecast": [106]}
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
