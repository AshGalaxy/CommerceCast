/**
 * @fileoverview Service for traditional time series forecasting models.
 */

/**
 * Performs a forecast using the Simple Exponential Smoothing (SES) method.
 *
 * @param data An array of historical numerical data points (e.g., sales numbers).
 * @param horizon The number of future periods to forecast.
 * @param alpha The smoothing factor (0 < alpha <= 1). Defaults to 0.5.
 * @returns An array of forecasted values for the specified horizon.
 */
export function simpleExponentialSmoothing(
  data: number[],
  horizon: number,
  alpha: number = 0.5
): number[] {
  if (data.length === 0) {
    return new Array(horizon).fill(0);
  }

  const smoothed: number[] = [];
  // Initialize the first smoothed value to be the first actual value
  smoothed[0] = data[0];

  // Generate the smoothed series for the historical data
  for (let i = 1; i < data.length; i++) {
    smoothed[i] = alpha * data[i] + (1 - alpha) * smoothed[i - 1];
  }

  // The last smoothed value is the best estimate for all future forecasts in SES
  const lastSmoothedValue = smoothed[smoothed.length - 1];
  
  // Generate the forecast for the horizon
  const forecast: number[] = [];
  for (let i = 0; i < horizon; i++) {
    forecast.push(lastSmoothedValue);
  }

  return forecast;
}

/**
 * Performs a forecast using Double Exponential Smoothing (Holt's Method).
 * This method is suitable for data with a trend.
 *
 * @param data An array of historical numerical data points.
 * @param horizon The number of future periods to forecast.
 * @param alpha The smoothing factor for the level (0 < alpha <= 1). Defaults to 0.5.
 * @param beta The smoothing factor for the trend (0 < beta <= 1). Defaults to 0.5.
 * @returns An array of forecasted values for the specified horizon.
 */
export function doubleExponentialSmoothing(
    data: number[],
    horizon: number,
    alpha: number = 0.5,
    beta: number = 0.5
): number[] {
    if (data.length < 2) {
        // Not enough data for a trend, fall back to SES or simple average
        if (data.length === 1) {
            return new Array(horizon).fill(data[0]);
        }
        return new Array(horizon).fill(0);
    }

    let level = data[0];
    let trend = data[1] - data[0]; // Initial trend

    const forecast: number[] = [];

    for (let i = 1; i < data.length; i++) {
        const lastLevel = level;
        // Calculate new level
        level = alpha * data[i] + (1 - alpha) * (lastLevel + trend);
        // Calculate new trend
        trend = beta * (level - lastLevel) + (1 - beta) * trend;
    }

    // Now, generate the future forecast
    for (let i = 1; i <= horizon; i++) {
        forecast.push(level + i * trend);
    }

    return forecast;
}
