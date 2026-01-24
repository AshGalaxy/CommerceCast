# 🛒 CommerceCast: The Ultimate E-Commerce Analytics Platform

**CommerceCast** is an intelligent, end-to-end analytics suite designed to transform raw e-commerce data into actionable insights. By leveraging **AI** and **Advanced Statistical Models**, it empowers businesses to predict trends, optimize inventory, and simulate growth strategies with precision.

---

## 🚀 Key Features Showcase

### 1. Executive Dashboard

Get a pulse on your business in real-time. The dashboard aggregates data from multiple sources to track vital KPIs like Revenue, Gross Margin, and Customer Lifetime Value (CLV).

**Key Metrics Tracked:**

* **Total Revenue & Net Profit**: Real-time financial health monitoring.
* **Customer Lifetime Value (CLV)**: Predictive analytics to identify high-value customer segments.
* **Churn Rate Analysis**: Early warning system for customer attrition.
* **Inventory Velocity**: Tracking how fast stock moves to optimize capital.

![Executive Dashboard Overview](screenshots/dashboard.png)
*Figure 1: The main command center displaying real-time financial health and activity.*

### 2. Advanced AI Forecasting

Stop guessing the future. Our hybrid ensemble engine uses a weighted model of three advanced algorithms:

* **Prophet**: Handles seasonality (weekly/yearly cycles) and holiday effects.
* **XGBoost**: Captures complex, non-linear trends and feature interactions (e.g., price vs. volume).
* **ARIMA**: Models linear dependencies and short-term trends.
* **Ensemble Logic**: Dynamically weights predictions based on historical accuracy (MAPE) for maximum precision 30-90 days out.

![Sales Forecasting Engine](screenshots/forecasting.png)
*Figure 2: AI-driven sales projections distinguishing between organic trend and seasonal spikes.*

### 3. Inventory Intelligence

Never run out of stock or hold dead inventory again. CommerceCast uses automated tiered classification:

* **ABC Analysis**: Automatically segments products into A (High Value), B (Medium), and C (Low Value) tiers based on the Pareto Principle.
* **Smart Reorder Points**: dynamic thresholds calculated using Lead Time Demand + Safety Stock.
* **Stock Status**: Real-time classification into "Overstock", "Healthy", and "Low Stock" with specific action recommendations (e.g., "Run Promotion" for Overstock).

![Inventory Management](screenshots/inventory.png)
*Figure 3: Smart inventory table highlighting low-stock items and overstocked goods.*

### 4. Promotion Simulator

Don't launch promotions blindly. Our simulator allows you to A/B test strategies before they go live.

* **Elasticity Modeling**: Uses Price Elasticity of Demand ($E=1.5$) to predict volume lift.
* **ROI Calculator**: Accurately forecasts Revenue Impact, Margin/Profit changes, and Net ROI.
* **Scenario Planning**: Compare a 10% discount vs. a 20% discount side-by-side.

![Promotion Simulator](screenshots/promotion.png)
*Figure 4: A/B testing a promotion to maximize profitability before launch.*

### 5. Automated AI Reports

Generate professional, boardroom-ready PDF reports in seconds.

* **Smart Analysis**: Uses **Google Gemini 1.5 Pro** to read your raw data and write an executive summary.
* **Strategic Insights**: AI identifies hidden trends and offers specific business recommendations.
* **Visual Reports**: Exports high-resolution charts and text into a downloadable PDF.

![AI Generated PDF Report](screenshots/comparison.png)
*Figure 5: High-quality PDF report automatically generated and ready for download.*

### 6. Seamless Data Integration

* **NoDatabase™ Architecture**: Leverages browser `localStorage` for zero-latency UI updates.
* **Google Sheets Sync**: Built-in OAuth2 integration allowing you to use a simple Google Sheet as your backend CMS.
* **CSV Support**: Drag-and-drop import for large historical datasets.

![Data Source Configuration](screenshots/datasources.png)
*Figure 6: One-click connection to Google Sheets and CSV uploads.*

---

## 🏗 Technology Stack

We use a modern, performance-first stack:

* **Frontend**: [Next.js 15](https://nextjs.org/) (App Router)
* **UI System**: [Shadcn UI](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/)
* **Backend Computing**: [Python FastAPI](https://fastapi.tiangolo.com/) + Pandas/NumPy
* **Machine Learning**: Facebook Prophet, XGBoost, Statsmodels
* **AI Orchestration**: [Google Genkit](https://firebase.google.com/docs/genkit) + Gemini 1.5 Pro
* **Deployment**: Vercel (Frontend) + Render (Backend)

---

## 🛠 Quick Start Guide

### 1. Installation

```powershell
# 1. Install Frontend Dependencies
npm install

# 2. Setup Python Backend
cd python-backend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
```

### 2. Running Locally

```powershell
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd python-backend
python main.py
```

Access the dashboard at `http://localhost:9002`.

---

*Built with ❤️ by the CommerceCast Team.*
