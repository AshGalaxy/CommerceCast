# 🛒 CommerceCast: E-Commerce Analytics Platform

**CommerceCast** is an end-to-end analytics suite that aggregates data from various sources into a unified dashboard. It leverages **Agentic AI** and **Statistical Machine Learning** to predict sales, optimize inventory, and simulate promotions.

---

## 🚀 Quick Start

### Prerequisites

- Node.js & npm
- Python 3.9+
- Git

### One-Command Setup

Running the following command will install dependencies and start both backend and frontend:

```powershell
npm run dev
# In a separate terminal
cd python-backend && python main.py
```

---

## 🏗 Architecture & Tech Stack

The system follows a modern **Microservices-lite** architecture:

### Frontend (Next.js 15)

- **Framework**: Next.js App Router for hybrid server/client rendering.
- **UI**: Shadcn UI + Tailwind CSS for a premium, accessible design.
- **AI**: Google Genkit for structured AI orchestration.

### Backend (Python FastAPI)

- **Engine**: FastAPI for high-performance statistical computing.
- **Models**:
  - **Prophet**: For seasonality and holiday detection.
  - **XGBoost**: For complex feature interactions (promotions, lags).
  - **ARIMA**: For linear trend analysis.
  - **Ensemble**: Combines all three for maximum accuracy.

### Data Layer

- **No-Database Architecture**: Uses `localStorage` and Google Sheets Sync for zero-overhead persistence.

---

## 📊 Key Features

### 1. Dashboard & Core KPIs

Real-time tracking of:

- **Total Revenue & Gross Margin**: True profitability tracking.
- **Customer CLV & Churn**: Identifying valuable customers vs. those at risk.
- **Slow Moving Inventory**: Automated "Dead Stock" alerts using the Pareto Principle (ABC Analysis).

### 2. AI Forecasting Engine

A hybrid ensemble model (Prophet + XGBoost + ARIMA) predicts sales 30-90 days out. It learns from:

- Historical seasonality (weekly/yearly)
- Price elasticity
- Rolling averages and lag features

### 3. Promotion Simulator

Test before you launch. The simulator uses **Price Elasticity of Demand** ($E=1.5$) to predict:

- Volume Lift
- Revenue Impact
- Roi Calculation

### 4. Smart Inventory

- **Reorder Points**: Automatically calculated based on lead time and safety stock.
- **Stock Status**: Classifies items as Overstock, In Stock, or Low Stock.

### 5. AI Reports

Generates professional PDF reports with executive summaries and actionable insights using Google Gemini.

---

## 🔧 Troubleshooting

- **Forecast Failed**: Ensure Python backend is running on port 8000 (`python main.py`).
- **Google Sheets Sync Failed**: Token may be expired. Click "Reconnect Google Account" in Data Sources.
- **Hydration Error**: Usually caused by date mismatches. Refresh the page or check console logs.

---

## 🤝 Contributing

1. **Fork** the repository.
2. **Create a Branch**: `git checkout -b feature/new-feature`
3. **Commit**: `git commit -m "Add new feature"`
4. **Push**: `git push origin feature/new-feature`
5. **Open a Pull Request**.

---

*Verified & Optimized for Performance.*
