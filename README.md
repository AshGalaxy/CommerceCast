# 🛒 CommerceCast: The Ultimate E-Commerce Analytics Platform
>
> **A Comprehensive, In-Depth Technical Guide**

Welcome to **CommerceCast**! 🚀

This document is the definitive guide to the CommerceCast platform. It is designed to be a "Master Class" in building modern analytics software. Whether you are a **Business Analyst**, a **Data Scientist**, or a **Full-Stack Developer**, this guide covers every single line of logic, every formula, and every architectural decision in the project.

---

## 📚 Table of Contents

1. [Chapter 1: Introduction & Architecture](#-chapter-1-introduction--architecture)
2. [Chapter 2: The Technology Stack (Deep Dive)](#-chapter-2-the-technology-stack-deep-dive)
3. [Chapter 3: Installation & Setup Guide](#-chapter-3-installation--setup-guide)
4. [Chapter 4: The Dashboard & KPI Dictionary](#-chapter-4-the-dashboard--kpi-dictionary)
5. [Chapter 5: Forecasting Engine (The Math & The Code)](#-chapter-5-forecasting-engine-the-math--the-code)
6. [Chapter 6: Inventory Management Algorithms](#-chapter-6-inventory-management-algorithms)
7. [Chapter 7: Promotion Simulator & ROI Logic](#-chapter-7-promotion-simulator--roi-logic)
8. [Chapter 8: Data Sources & Google Sheets Sync](#-chapter-8-data-sources--google-sheets-sync)
9. [Chapter 9: Comparison & A/B Testing](#-chapter-9-comparison--ab-testing)
10. [Chapter 10: Report Generation & AI Backend](#-chapter-10-report-generation--ai-backend)
11. [Chapter 11: Project Structure & Contributing](#-chapter-11-project-structure--contributing)
12. [Chapter 12: Troubleshooting & FAQ](#-chapter-12-troubleshooting--faq)
13. [Chapter 13: Security Best Practices](#-chapter-13-security-best-practices)
14. [Chapter 14: Glossary of Terms](#-chapter-14-glossary-of-terms)
15. [Chapter 15: Codebase Deep Dive](#-chapter-15-codebase-deep-dive-line-by-line)
16. [Chapter 16: Future Roadmap](#-chapter-16-future-roadmap)

---

## 📖 Chapter 1: Introduction & Architecture

### What is CommerceCast?

CommerceCast is an end-to-end analytics suite for e-commerce businesses. It solves the "Data Silo" problem by aggregating data from various sources (CSV, Google Sheets) into a unified dashboard.

But it goes beyond simple visualization. It uses **Agentic AI** and **Statistical Machine Learning** to:

1. **Predict the Future**: Forecast sales for the next 30-90 days.
2. **Optimize Inventory**: Tell you exactly when to reorder stock.
3. **Plan Promotions**: Simulate the outcome of a 20% discount before you launch it.
4. **Automate Reporting**: Write professional PDF reports for stakeholders.

### System Architecture

The system follows a **Microservices-lite** architecture:

1. **The Frontend (Next.js)**: Handles UI, State Management, and AI Orchestration (via Genkit).
2. **The Forecasting Engine (Python/FastAPI)**: A dedicated computation server for heavy statistical models (ARIMA, XGBoost).
3. **The AI Layer (Google Vertex AI)**: Provides reasoning capabilities for qualitative insights.

---

## 🛠 Chapter 2: The Technology Stack (Deep Dive)

We didn't just pick random tools. Here is the *why* and *how* for every major library.

### 1. Frontend: Next.js 14 (App Router)

* **Why**: We needed Server-Side Rendering (SSR) for fast initial loads and SEO, but Client-Side interactivity for the charts. Next.js App Router allows us to mix Server Components (for data fetching) and Client Components (for charts).
* **Key Feature**: `use server` actions allow us to call backend logic directly from the frontend without setting up a separate API route for everything.

### 2. UI Library: Shadcn UI + Tailwind CSS

* **Why**: Traditional CSS is slow to write. Tailwind allows "Utility-First" styling. Shadcn UI gives us accessible, keyboard-navigable components (Dialogs, Selects) that copy-paste directly into our code, giving us full control.
* **Key Components**: `Card` (for KPIs), `Dialog` (for drill-downs), `Table` (for data grids).

### 3. Charting: Recharts

* **Why**: It is built on SVG (Scalable Vector Graphics), meaning charts look crisp on any screen size. It is composable (`<LineChart><XAxis /><Line /></LineChart>`), making it easy to build complex visualizations like the "Revenue vs Volume" dual-axis chart.

### 4. AI Orchestration: Google Genkit

* **Why**: Managing LLM prompts is hard. Genkit provides a structured way to define "Flows" (Input Schema -> Prompt -> Output Schema). It enforces type safety, ensuring the AI returns valid JSON, not random text.
* **Model**: `gemini-1.5-flash` (Fast, low latency) for interactive chats, and `gemini-1.5-pro` (High reasoning) for complex report generation.

### 5. Backend: FastAPI (Python)

* **Why**: Python is the lingua franca of Data Science. Node.js is great for web, but terrible for matrix multiplication. We use FastAPI because it is:
  * **Fast**: Built on Starlette and Pydantic.
  * **Type-Safe**: Uses Python type hints for automatic validation.
  * **Async**: Can handle multiple forecast requests simultaneously.

### 6. Forecasting Libraries

* **Prophet**: Developed by Facebook. It handles missing data and outliers well. It works by fitting a decomposable time series model with three main components: trend, seasonality, and holidays.
  * $$ y(t) = g(t) + s(t) + h(t) + \epsilon_t $$
* **Statsmodels (ARIMA)**: The "Classic" statistical approach. It assumes the future is a linear function of the past.
* **XGBoost**: A Gradient Boosting framework. It builds an ensemble of decision trees. We use it for "Recursive Forecasting", where the prediction for $t+1$ is used as an input for $t+2$.

---

## 🚀 Chapter 3: Installation & Setup Guide

## Quick Start (Recommended)

One command to set up and run everything (Windows):

```powershell
./setup_project.ps1
```

This script will:

1. Detect the correct Python version (standard Windows Python).
2. Create a fresh virtual environment.
3. Install all backend and frontend dependencies (using binary wheels for speed).
4. Start both the Python Backend and Next.js Frontend.

## Manual Setup

### Prerequisites

- Node.js & npm
* Python 3.9+ (Standard Windows Installer, NOT MinGW/Git Bash version)

### 1. Backend (Python)

```powershell
cd python-backend
# Create venv
python -m venv venv
# Activate
.\venv\Scripts\Activate.ps1
# Install dependencies
pip install -r requirements.txt
# Run
python main.py
```

*Success Check*: Open `http://localhost:8000`. You should see `{"status": "ok"}`.

### Step 2: The Frontend

The face of the operation.

```bash
# 1. Navigate to root
cd ..

# 2. Install Node modules
npm install

# 3. Run the development server
npm run dev
```

*Success Check*: Open `http://localhost:9002`. You should see the Dashboard.

### Step 3: The AI Engine (Genkit)

Required for "AI Insights" and "Smart Forecasting".

```bash
# 1. Open a NEW terminal
# 2. Run Genkit
npx genkit start -- tsx src/ai/dev.ts
```

*Success Check*: The Genkit Developer UI will open at `http://localhost:4000`.

---

## 📊 Chapter 4: The Dashboard & KPI Dictionary

The Dashboard is the command center. It aggregates data into actionable metrics.

### 1. Core Financial Metrics

* **Total Revenue**: The lifeblood of the business.
  * *Formula*: $$ \sum_{i=1}^{n} (\text{Quantity}_i \times \text{Price}_i) $$
  * *Code*: `filteredData.reduce((acc, item) => acc + item.sales * item.price, 0)`
* **Gross Margin**: The true profitability.
  * *Formula*: $$ \frac{\text{Revenue} - \text{COGS}}{\text{Revenue}} \times 100 $$
  * *Why it matters*: High revenue with low margin means you are working hard for free.
* **Break-Even Point**: The survival line.
  * *Formula*: $$ \frac{\text{Fixed Costs}}{\text{Gross Margin \%}} $$

### 2. Customer Insights (The "Who")

* **Customer Lifetime Value (CLV)**: The total predicted revenue from a single customer.
  * *Formula*: $$ \text{Avg Order Value} \times \text{Purchase Frequency} \times \text{Customer Lifespan} $$
* **Churn Rate**: The percentage of customers leaving.
  * *Formula*: $$ \frac{\text{Customers Lost in Period}}{\text{Total Customers at Start}} \times 100 $$
  * *Logic*: We define "Lost" as a customer who hasn't purchased in 30 days.

### 3. Product Performance

* **Slow Moving Inventory**: Items that are "Dead Stock".
  * *Algorithm*:
        1. Get list of all products with `Stock > 0`.
        2. Get list of all products sold in the last 30 days.
        3. Find the difference (Set A - Set B).
        4. Sort by Stock Level descending.

---

## 🔮 Chapter 5: Forecasting Engine (The Math & The Code)

This is the most technically complex part of the system. We use a **Hybrid Ensemble Approach**.

### 1. The Models Explained

#### A. ARIMA (Auto-Regressive Integrated Moving Average)

* **Best For**: Short-term trends, linear data.
* **The Math**:
    $$ y_t = c + \phi_1 y_{t-1} + \dots + \phi_p y_{t-p} + \theta_1 \epsilon_{t-1} + \dots + \theta_q \epsilon_{t-q} + \epsilon_t $$
* **Our Implementation**: We use `statsmodels`. We perform a **Grid Search** to find the optimal $(p, d, q)$ parameters.

    ```python
    # python-backend/main.py
    p_values = [0, 1, 2, 4]
    d_values = [0, 1, 2]
    q_values = [0, 1, 2]
    # We loop through all combinations and pick the one with the lowest AIC (Akaike Information Criterion).
    ```

#### B. Facebook Prophet

* **Best For**: Seasonality (Weekly/Yearly), Holidays, Missing Data.
* **The Math**: A decomposable additive model.
    $$ y(t) = g(t) + s(t) + h(t) + \epsilon_t $$
  * $g(t)$: Trend function (piecewise linear or logistic).
  * $s(t)$: Seasonality (Fourier series).
  * $h(t)$: Holidays (indicator functions).
* **Our Implementation**: We feed it the raw `ds` (date) and `y` (sales) columns. It automatically detects weekly patterns (e.g., higher sales on weekends).

#### C. XGBoost (Extreme Gradient Boosting)

* **Best For**: Complex, non-linear relationships and external features (e.g., Promotions).
* **Feature Engineering**: We create "Lag Features" to help the model "see" the past.
  * `lag_1`: Sales yesterday.
  * `lag_7`: Sales last week (same day).
  * `rolling_mean_7`: Average sales of the last 7 days.
* **Recursive Forecasting**:
  * To predict Day 30, we first predict Day 1.
  * We use Day 1's prediction as an input to predict Day 2.
  * We repeat this 30 times.

### 2. The Ensemble Logic

Why rely on one expert when you can ask three?

* **Logic**: We run all three models independently.
* **Weighting**:
    $$ \text{Final Forecast} = (0.4 \times \text{Prophet}) + (0.4 \times \text{XGBoost}) + (0.2 \times \text{ARIMA}) $$
* *Note*: Weights can be adjusted based on historical accuracy (MAPE).

### 3. The API Endpoint (`/forecast`)

* **Input**:

    ```json
    {
      "data": [{"ds": "2023-01-01", "y": 100}, ...],
      "periods": 30,
      "model": "ensemble"
    }
    ```

## 📦 Chapter 6: Inventory Management Algorithms

Managing stock is a balancing act. Too much stock = wasted money. Too little stock = lost sales.

### 1. ABC Analysis (The Pareto Principle)

We automatically classify every product into three tiers based on revenue contribution.

* **A Items (The Stars)**: Top 20% of products generating 80% of revenue.
  * *Strategy*: Strict control, frequent reordering.
* **B Items (The Regulars)**: Next 30% of products generating 15% of revenue.
  * *Strategy*: Moderate control.
* **C Items (The Long Tail)**: Bottom 50% of products generating 5% of revenue.
  * *Strategy*: Loose control, bulk ordering.

### 2. Reorder Point Calculation

When should you place an order?

* **Formula**:
    $$ \text{Reorder Point} = (\text{Avg Daily Sales} \times \text{Lead Time}) + \text{Safety Stock} $$
* **Safety Stock**:
    $$ \text{Safety Stock} = (\text{Max Daily Sales} \times \text{Max Lead Time}) - (\text{Avg Daily Sales} \times \text{Avg Lead Time}) $$
* *Code Implementation*:

    ```typescript
    // src/app/dashboard/inventory/page.tsx
    const dailyVelocity = sales_90d / 90;
    const reorderPoint = (dailyVelocity * leadTime) + safetyStock;
    const status = stock <= reorderPoint ? 'Low Stock' : 'In Stock';
    ```

### 3. Stock Status Logic

* **Overstock**: If `Days Supply > 90`.
  * *Action*: Recommend a discount to clear space.
* **Out of Stock**: If `Stock == 0`.
  * *Action*: Urgent alert.

---

## 🏷️ Chapter 7: Promotion Simulator & ROI Logic

This feature allows users to "A/B Test" a promotion before launching it.

### 1. The Simulation Engine

We use the concept of **Price Elasticity of Demand**.

* **Assumption**: Lower Price = Higher Volume.
* **Elasticity Coefficient ($E$)**: We assume $E = 1.5$ (for every 1% drop in price, demand rises by 1.5%).
* **The Math**:
    1. **New Price**: $P_{new} = P_{old} \times (1 - \text{Discount \%})$
    2. **Volume Lift**: $\text{Lift \%} = \text{Discount \%} \times E$
    3. **New Volume**: $V_{new} = V_{old} \times (1 + \text{Lift \%})$
    4. **Projected Revenue**: $R_{new} = P_{new} \times V_{new}$

### 2. ROI Calculation

Did we make money?

* **Cost of Discount**: $(P_{old} - P_{new}) \times V_{new}$
* **Additional Margin**: $(V_{new} - V_{old}) \times (P_{new} - \text{COGS})$
* **ROI %**:
    $$ \frac{\text{Additional Margin} - \text{Marketing Cost}}{\text{Marketing Cost}} \times 100 $$

---

## 🔗 Chapter 8: Data Sources & Google Sheets Sync

How do we get data without a database?

### 1. The "No-Database" Architecture

We use the browser's **LocalStorage** and **Google Sheets** as our database. This makes the app free to host and easy to set up.

### 2. The Sync Engine (`GoogleSheetAutoSync.tsx`)

This is a background component that runs every $X$ minutes.

* **Step 1: Authorization**:
    We use OAuth2 to get an `access_token` from Google.

    ```typescript
    // src/ai/flows/google-sheets-flow.ts
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });
    ```

* **Step 2: Fetching Data**:
    We call the Sheets API v4.

    ```typescript
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:Z',
    });
    ```

* **Step 3: Parsing**:
    The data comes back as a 2D array of strings. We parse it into JSON objects (`{ date: '...', sales: 100 }`) and save it to `localStorage`.

* **Step 4: Reactivity**:
    We use a custom React Hook `useLocalStorage` that listens for `storage` events. When the background worker updates the storage, the Dashboard UI automatically re-renders.

---

## ⚖️ Chapter 9: Comparison & A/B Testing

This page allows you to compare two different time periods or two different products side-by-side.

### 1. The Logic

* **Normalization**: To compare a product with \$100 sales vs a product with \$10,000 sales, we often use "Percentage Growth" rather than absolute numbers.
    $$ \text{Growth \%} = \frac{\text{Current} - \text{Previous}}{\text{Previous}} \times 100 $$
* **Visuals**: We use a "Sync Chart" (Recharts `CategoricalChartWrapper`) where hovering over one chart highlights the same date on the other chart.

---

## 📄 Chapter 10: Report Generation & AI Backend

This is where the "Agentic" part of the app shines. We don't just dump data; we explain it.

### 1. PDF Generation Pipeline

How do we turn a React page into a PDF?

1. **Capture**: `html2canvas` takes a screenshot of the DOM elements.
2. **Compile**: `jspdf` creates a PDF container.
3. **Enrich**: We inject text generated by Gemini into the PDF before saving.

### 2. The AI Prompts (The "Secret Sauce")

Here are the actual system prompts we use to make the AI sound like a Business Analyst.

#### A. The "Business Analyst" Prompt (`report-generator.ts`)
>
> "You are a world-class business analyst...
> CRITICAL INSTRUCTIONS:
>
> 1. **Currency**: All monetary values MUST be presented in Indian Rupees (INR).
> 2. **Brevity**: Your analysis must be concise.
> 3. **Formatting**: Use excellent Markdown.
>
> DATA FOR ANALYSIS:
>
> * Historical Sales (CSV): {{{salesData}}}
> * Demand Forecast (JSON): {{{forecastData}}}
>
> REQUIRED REPORT STRUCTURE:
>
> 1. Executive Summary (Under 100 words)
> 2. KPIs (Revenue, Sales Volume)
> 3. Analysis (Trends, Patterns)
> 4. Recommendations (Actionable steps)"

*Why this works*: We explicitly constrain the output ("Under 100 words", "Markdown list") to ensure it fits perfectly on the PDF page.

#### B. The "Smart Promotion Planner" Prompt (`smart-promotion-planner.ts`)
>
> "You are an expert promotion planner...
> Look for slow-moving products in high-inventory...
>
> RULES based on Insights:
>
> * If Status is 'Overstock': You MUST recommend a Clearance/Discount.
> * If Status is 'Healthy': Recommend strategic bundles.
> * If Status is 'Low Stock': Do NOT recommend a discount.
>
> Provide a list of data-driven promotion suggestions."

*Why this works*: We give the AI "Business Rules" (If X then Y). This prevents it from hallucinating bad advice (like discounting a product that is already out of stock).

---

## 🗺 Chapter 11: Project Structure & Contributing

### 1. The Map

Where does everything live?

```
CommerceCast/
├── python-backend/             # 🧠 The Forecasting Engine
│   ├── main.py                 # FastAPI Server (The API)
│   ├── requirements.txt        # Python Dependencies
│   └── forecasting_models.py   # (Logic for ARIMA/Prophet)
├── src/
│   ├── app/                    # 🌐 The Frontend (Next.js)
│   │   ├── dashboard/          # All Dashboard Pages
│   │   │   ├── page.tsx        # Main Overview
│   │   │   ├── inventory/      # Inventory Logic
│   │   │   ├── forecasting/    # Forecasting Logic
│   │   │   └── ...
│   │   └── api/                # Next.js API Routes
│   ├── components/             # 🧱 UI Building Blocks
│   │   ├── ui/                 # Shadcn (Button, Card, Input)
│   │   └── dashboard/          # Charts (SalesChart, PieChart)
│   ├── ai/                     # 🤖 Genkit Flows
│   │   ├── flows/              # The Prompt Definitions
│   │   └── genkit.ts           # Config
│   └── lib/                    # 🛠 Helpers
│       └── utils.ts            # Math & Formatting functions
└── public/                     # 🖼 Static Assets
```

### 2. Contributing Guide

1. **Fork** the repository.
2. **Clone** it to your machine.
3. **Create a Branch**: `git checkout -b feature/amazing-new-chart`
4. **Commit**: `git commit -m "Added a 3D Pie Chart"`
5. **Push**: `git push origin feature/amazing-new-chart`
6. **Open a Pull Request**.

---

*Documentation generated by the CommerceCast Team.*
*Last Updated: December 2025*

---

## 🔧 Chapter 12: Troubleshooting & FAQ

Things go wrong. Here is how to fix them.

### 1. "Forecast Failed" Error

* **Symptom**: You click "Generate Forecast" and see a red error toast.
* **Cause**: The Python backend is not running or crashed.
* **Fix**:
    1. Check your terminal running `python main.py`.
    2. If it says `Connection Refused`, restart the server.
    3. If it says `ModuleNotFoundError`, run `pip install -r requirements.txt`.

### 2. "Google Sheets Sync Failed"

* **Symptom**: Dashboard data is old.
* **Cause**: The OAuth token expired (Google tokens last 1 hour).
* **Fix**:
    1. Go to `Data Sources`.
    2. Click "Reconnect Google Account".
    3. This will refresh the token in `localStorage`.

### 3. "Hydration Error" in Console

* **Symptom**: The screen flickers white on load.
* **Cause**: Next.js Server HTML doesn't match Client HTML (usually due to Dates).
* **Fix**: We use `suppressHydrationWarning` on the `<body>` tag, but if you see this, ensure you aren't using `new Date()` directly in JSX without a `useEffect`.

---

## 🔒 Chapter 13: Security Best Practices

Even though this is an internal tool, security matters.

### 1. API Keys

* **Rule**: NEVER commit `.env` files to GitHub.
* **Implementation**: We use `dotenv` in Python and `next.config.js` in Frontend to load secrets.
* **Google Credentials**: The `credentials.json` for OAuth should be kept local.

### 2. Data Privacy

* **Rule**: Customer PII (Personally Identifiable Information) like Emails/Phones.
* **Implementation**:
  * The Dashboard only displays *aggregates*.
  * We do NOT send PII to the Python backend, only `date` and `sales_amount`.
  * We do NOT send PII to Gemini AI, only anonymized metrics.

### 3. Dependency Scanning

* **Rule**: Keep libraries updated.
* **Implementation**: Run `npm audit` and `pip list --outdated` weekly to catch vulnerabilities.

---

## 📖 Chapter 14: Glossary of Terms

A dictionary for the non-technical team members.

### A

* **API (Application Programming Interface)**: A waiter that takes your order (Frontend) to the kitchen (Backend) and brings back the food (Data).
* **ARIMA**: A statistical model for forecasting. Think of it as "Advanced Moving Average".

### B

* **Backend**: The part of the app you don't see. It runs the logic and math.
* **Bug**: A mistake in the code. Not an insect.

### C

* **Cache**: A temporary storage area. We use `localStorage` as a cache so we don't have to call Google Sheets every second.
* **Component**: A building block of the UI (e.g., a Button, a Card).
* **CSV (Comma Separated Values)**: A simple text file that looks like a spreadsheet.

### D

* **Deployment**: Putting the website on the internet so others can use it.
* **DOM (Document Object Model)**: The tree structure of the HTML page.

### E

* **Endpoint**: A specific URL on the backend (e.g., `/forecast`) that performs a function.
* **Environment Variable**: Secret keys (passwords) that are stored outside the code.

### F

* **Frontend**: The part of the app you see (the website).
* **Full-Stack**: A developer who can do both Frontend and Backend.

### G

* **Git**: A time machine for code. It lets us save versions and go back if we break something.
* **GUI (Graphical User Interface)**: Buttons and icons, as opposed to a command line.

### H

* **Hook (React)**: A special function (starting with `use`) that lets us "hook" into React features like state.

### I

* **IDE (Integrated Development Environment)**: The software we use to write code (VS Code).

### J

* **JSON (JavaScript Object Notation)**: The language servers speak. It looks like `{"name": "Ashraf"}`.

### K

* **KPI (Key Performance Indicator)**: A number that tells you how well you are doing (e.g., Revenue).

### L

* **Latency**: The delay between clicking a button and seeing the result.
* **Library**: Code written by someone else that we use (e.g., React, Pandas).

### M

* **Model (AI)**: A mathematical file that has "learned" patterns.
* **MVP (Minimum Viable Product)**: The simplest version of the app that works.

### N

* **Node.js**: A tool that lets us run JavaScript outside the browser.

### O

* **OAuth**: A secure way to log in using Google/Facebook without giving your password.

### P

* **Prop (React)**: Information passed from a parent component to a child (like passing an apple to a child).
* **Pull Request (PR)**: Asking permission to merge your code changes into the main project.

### R

* **Refactoring**: Cleaning up code without changing what it does.
* **Responsive Design**: Making the site look good on Mobile and Desktop.

### S

* **Server-Side Rendering (SSR)**: Building the HTML on the server before sending it to the browser. Faster and better for SEO.
* **SQL (Structured Query Language)**: A language for talking to databases.

### T

* **Terminal**: The black screen where hackers (and us) type commands.
* **Token**: A digital keycard that proves you are logged in.

### U

* **UI/UX**: User Interface (how it looks) / User Experience (how it feels).

### V

```
CommerceCast/
├── python-backend/             # 🧠 The Forecasting Engine
│   ├── main.py                 # FastAPI Server (The API)
│   ├── requirements.txt        # Python Dependencies
│   └── forecasting_models.py   # (Logic for ARIMA/Prophet)
├── src/
│   ├── app/                    # 🌐 The Frontend (Next.js)
│   │   ├── dashboard/          # All Dashboard Pages
│   │   │   ├── page.tsx        # Main Overview
│   │   │   ├── inventory/      # Inventory Logic
│   │   │   ├── forecasting/    # Forecasting Logic
│   │   │   └── ...
│   │   └── api/                # Next.js API Routes
│   ├── components/             # 🧱 UI Building Blocks
│   │   ├── ui/                 # Shadcn (Button, Card, Input)
│   │   └── dashboard/          # Charts (SalesChart, PieChart)
│   ├── ai/                     # 🤖 Genkit Flows
│   │   ├── flows/              # The Prompt Definitions
│   │   └── genkit.ts           # Config
│   └── lib/                    # 🛠 Helpers
│       └── utils.ts            # Math & Formatting functions
└── public/                     # 🖼 Static Assets
```

### 2. Contributing Guide

1. **Fork** the repository.
2. **Clone** it to your machine.
3. **Create a Branch**: `git checkout -b feature/amazing-new-chart`
4. **Commit**: `git commit -m "Added a 3D Pie Chart"`
5. **Push**: `git push origin feature/amazing-new-chart`
6. **Open a Pull Request**.

---

*Documentation generated by the CommerceCast Team.*
*Last Updated: December 2025*

---

## 🔧 Chapter 12: Troubleshooting & FAQ

Things go wrong. Here is how to fix them.

### Issue 1: "Forecast Failed" Error

* **Symptom**: You click "Generate Forecast" and see a red error toast.
* **Cause**: The Python backend is not running or crashed.
* **Fix**:
    1. Check your terminal running `python main.py`.
    2. If it says `Connection Refused`, restart the server.
    3. If it says `ModuleNotFoundError`, run `pip install -r requirements.txt`.

### Issue 2: "Google Sheets Sync Failed"

* **Symptom**: Dashboard data is old.
* **Cause**: The OAuth token expired (Google tokens last 1 hour).
* **Fix**:
    1. Go to `Data Sources`.
    2. Click "Reconnect Google Account".
    3. This will refresh the token in `localStorage`.

### Issue 3: "Hydration Error" in Console

* **Symptom**: The screen flickers white on load.
* **Cause**: Next.js Server HTML doesn't match Client HTML (usually due to Dates).
* **Fix**: We use `suppressHydrationWarning` on the `<body>` tag, but if you see this, ensure you aren't using `new Date()` directly in JSX without a `useEffect`.

---

## 🔒 Chapter 13: Security Best Practices

Even though this is an internal tool, security matters.

### 1. API Keys

* **Rule**: NEVER commit `.env` files to GitHub.
* **Implementation**: We use `dotenv` in Python and `next.config.js` in Frontend to load secrets.
* **Google Credentials**: The `credentials.json` for OAuth should be kept local.

### 2. Data Privacy

* **Rule**: Customer PII (Personally Identifiable Information) like Emails/Phones.
* **Implementation**:
  * The Dashboard only displays *aggregates*.
  * We do NOT send PII to the Python backend, only `date` and `sales_amount`.
  * We do NOT send PII to Gemini AI, only anonymized metrics.

### 3. Dependency Scanning

* **Rule**: Keep libraries updated.
* **Implementation**: Run `npm audit` and `pip list --outdated` weekly to catch vulnerabilities.

---

## 📖 Chapter 14: Glossary of Terms

A dictionary for the non-technical team members.

### Term: A

* **API (Application Programming Interface)**: A waiter that takes your order (Frontend) to the kitchen (Backend) and brings back the food (Data).
* **ARIMA**: A statistical model for forecasting. Think of it as "Advanced Moving Average".

### Term: B

* **Backend**: The part of the app you don't see. It runs the logic and math.
* **Bug**: A mistake in the code. Not an insect.

### Term: C

* **Cache**: A temporary storage area. We use `localStorage` as a cache so we don't have to call Google Sheets every second.
* **Component**: A building block of the UI (e.g., a Button, a Card).
* **CSV (Comma Separated Values)**: A simple text file that looks like a spreadsheet.

### Term: D

* **Deployment**: Putting the website on the internet so others can use it.
* **DOM (Document Object Model)**: The tree structure of the HTML page.

### Term: E

* **Endpoint**: A specific URL on the backend (e.g., `/forecast`) that performs a function.
* **Environment Variable**: Secret keys (passwords) that are stored outside the code.

### Term: F

* **Frontend**: The part of the app you see (the website).
* **Full-Stack**: A developer who can do both Frontend and Backend.

### Term: G

* **Git**: A time machine for code. It lets us save versions and go back if we break something.
* **GUI (Graphical User Interface)**: Buttons and icons, as opposed to a command line.

### Term: H

* **Hook (React)**: A special function (starting with `use`) that lets us "hook" into React features like state.

### Term: I

* **IDE (Integrated Development Environment)**: The software we use to write code (VS Code).

### Term: J

* **JSON (JavaScript Object Notation)**: The language servers speak. It looks like `{"name": "Ashraf"}`.

### Term: K

* **KPI (Key Performance Indicator)**: A number that tells you how well you are doing (e.g., Revenue).

### Term: L

* **Latency**: The delay between clicking a button and seeing the result.
* **Library**: Code written by someone else that we use (e.g., React, Pandas).

### Term: M

* **Model (AI)**: A mathematical file that has "learned" patterns.
* **MVP (Minimum Viable Product)**: The simplest version of the app that works.

### Term: N

* **Node.js**: A tool that lets us run JavaScript outside the browser.

### Term: O

* **OAuth**: A secure way to log in using Google/Facebook without giving your password.

### Term: P

* **Prop (React)**: Information passed from a parent component to a child (like passing an apple to a child).
* **Pull Request (PR)**: Asking permission to merge your code changes into the main project.

### Term: R

* **Refactoring**: Cleaning up code without changing what it does.
* **Responsive Design**: Making the site look good on Mobile and Desktop.

### Term: S

* **Server-Side Rendering (SSR)**: Building the HTML on the server before sending it to the browser. Faster and better for SEO.
* **SQL (Structured Query Language)**: A language for talking to databases.

### Term: T

* **Terminal**: The black screen where hackers (and us) type commands.
* **Token**: A digital keycard that proves you are logged in.

### Term: U

* **UI/UX**: User Interface (how it looks) / User Experience (how it feels).

### Term: V

* **Version Control**: See "Git".

### W

* **Webhook**: A way for one app to "text" another app when something happens.

---

## 💻 Chapter 15: Codebase Deep Dive (Line-by-Line)

This section is for developers who want to understand the *exact* implementation details.

### 1. The Forecasting Engine (`python-backend/main.py`)

This file is the heart of our predictive capabilities.

#### Function: `train_predict_xgboost`

This function implements "Recursive Forecasting".

```python
def train_predict_xgboost(df, periods):
    # 1. Feature Engineering
    # We create "Lag Features" (past values) to help the model learn trends.
    for lag in [1, 7, 14, 30]:
        df_features[f'lag_{lag}'] = df_features['y'].shift(lag)
    
    # 2. Rolling Statistics
    # We calculate the average sales of the last 7 days to smooth out noise.
    df_features['rolling_mean_7'] = df_features['y'].shift(1).rolling(window=7).mean()

    # 3. Training
    # We use 1000 trees (n_estimators=1000) with a learning rate of 0.01.
    model = xgb.XGBRegressor(...)
    model.fit(X_train, y_train, ...)

    # 4. Recursive Prediction Loop
    # This is the tricky part. To predict Day 2, we need Day 1's sales.
    # But Day 1 is in the future! So we use our *prediction* for Day 1 as the input.
    for date in future_dates:
        # ... create new row ...
        # ... fill lags with previous predictions ...
        pred = model.predict(new_row)
        future_preds.append(pred)
```

### 2. The Dashboard Logic (`src/app/dashboard/page.tsx`)

This file aggregates the raw data into KPIs.

#### KPI Calculation: `metrics` useMemo

We use `useMemo` so we don't re-calculate 10,000 rows every time the user clicks a button.

```typescript
const metrics = useMemo(() => {
    // 1. Filter Data
    // We only look at data within the selected Date Range.
    const filtered = data.filter(d => d.date >= startDate && d.date <= endDate);

    // 2. Calculate Revenue
    // We sum up (Sales * Price) for every row.
    const revenue = filtered.reduce((sum, item) => sum + (item.sales * item.price), 0);

    // 3. Calculate Growth
    // We compare this period's revenue vs the previous period's revenue.
    const growth = ((revenue - prevRevenue) / prevRevenue) * 100;

    return { revenue, growth, ... };
}, [data, dateRange]); // Only re-run if data or date changes
```

### 3. The Pie Chart Logic (`src/components/dashboard/sales-by-region.tsx`)

Problem: If you have 50 regions, the Pie Chart looks like a mess.
Solution: "Top N + Others".

```typescript
const { displayData } = useMemo(() => {
    // 1. Sort by Value (High to Low)
    const sorted = [...data].sort((a, b) => b.value - a.value);

    // 2. Determine Cutoff
    // We want the Top N items to represent at least 50% of total sales.
    // But we cap it at 10 items max.
    let splitIndex = 5;
    for (let i = 0; i < sorted.length; i++) {
        accumulated += sorted[i].value;
        if (accumulated > total / 2) {
            splitIndex = i + 1;
            break;
        }
    }

    // 3. Group the Rest
    const topN = sorted.slice(0, splitIndex);
    const others = sorted.slice(splitIndex);
    const othersValue = others.reduce((sum, item) => sum + item.value, 0);

    // 4. Return Final Array
    return [...topN, { name: 'Others', value: othersValue }];
}, [data]);
```

### 4. The Utility Functions (`src/lib/utils.ts`)

Small helpers that make life easier.

#### Function: `cn` (Class Name Merger)

We use `clsx` and `tailwind-merge`.

* `clsx`: Lets us toggle classes conditionally (`isActive && 'bg-blue-500'`).
* `tailwind-merge`: Solves conflicts. If you have `p-4` and `p-2`, it keeps the last one (`p-2`) instead of having both in the DOM.

```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 🏁 Final Words

You have reached the end of the documentation.

We built **CommerceCast** to be more than just a dashboard. It is a **Decision Support System**. By combining:

1. **Rigorous Statistics** (ARIMA/Prophet)
2. **Modern AI** (Gemini/Genkit)
3. **Clean UI** (Shadcn/Next.js)

We empower business owners to stop guessing and start knowing.

**Happy Coding!** 🚀

---

## 🛣️ Chapter 16: Future Roadmap

What's next for CommerceCast?

### 1. Phase 1: Advanced AI (Q1 2026)

* **Chat with Data**: "Hey CommerceCast, why did sales drop last Tuesday?"
* **Voice Interface**: Ask questions using your microphone.

### 2. Phase 2: Integrations (Q2 2026)

* **Shopify Sync**: Direct connection to Shopify API.
* **WooCommerce Plugin**: A WordPress plugin to export data.

### 3. Phase 3: Mobile App (Q3 2026)

* **React Native**: Build an iOS/Android app using the same codebase.
* **Push Notifications**: "Stock Alert: T-Shirts are running low!"

---

*Documentation generated by the CommerceCast Team.*
*Last Updated: December 2025*

```
