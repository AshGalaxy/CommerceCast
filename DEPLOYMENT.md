# detailed Deployment Guide for CommerceCast

This guide covers deploying the **CommerceCast** application to production using **Vercel** for the frontend and **Render** for the backend (Python).

## Prerequisites

1. **GitHub Account**: You need a [GitHub account](https://github.com/).
2. **Git Installed**: Ensure Git is installed locally.
3. **Project Ready**: Your project should be running locally without errors (verified).

---

## Part 1: GitHub Repository Setup

1. **Initialize Git** (if not done):

    ```powershell
    git init
    git add .
    git commit -m "Ready for deployment"
    ```

2. **Create Repository**:
    - Go to [GitHub.com](https://github.com/new).
    - Create a new repository named `CommerceCast`.
    - **Do not** initialize with README or .gitignore (you already have them).
3. **Push Code**:

    ```powershell
    git remote add origin https://github.com/YOUR_USERNAME/CommerceCast.git
    git branch -M main
    git push -u origin main
    ```

---

## Part 2: Backend Deployment (Render)

We deploy the backend first to get the API URL.

1. **Sign Up**: Go to [render.com](https://render.com) and sign up with GitHub.
2. **Create Web Service**:
    - Click **"New +"** -> **"Web Service"**.
    - Select your `CommerceCast` repository.
3. **Configure Service**:
    - **Name**: `commercecast-api` (or similar)
    - **Region**: Choose one close to you (e.g., Singapore, Frankfurt, Oregon).
    - **Branch**: `main`
    - **Root Directory**: `python-backend` (Important!)
    - **Runtime**: `Python 3`
    - **Build Command**: `pip install -r requirements.txt`
    - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables**:
    - Scroll down to "Environment Variables".
    - Add any secrets if your backend needs them (currently none for the basic version, but if you add DB later, put `DATABASE_URL` here).
5. **Deploy**:
    - Click **"Create Web Service"**.
    - Wait for the build to finish. It will show "Live".
    - **Copy the URL**: It will look like `https://commercecast-api.onrender.com`.

---

## Part 3: Frontend Deployment (Vercel)

Now we deploy the Next.js frontend and connect it to the backend.

1. **Sign Up**: Go to [vercel.com](https://vercel.com) and sign up with GitHub.
2. **Add New Project**:
    - Click **"Add New Project"**.
    - Import the `CommerceCast` repository.
3. **Configure Project**:
    - **Framework Preset**: `Next.js` (should be auto-detected).
    - **Root Directory**: `./` (default).
    - **Build Command**: `next build` (default).
4. **Environment Variables** (Crucial!):
    - Expand **"Environment Variables"**.
    - Add `GEMINI_API_KEY`: Paste your key from `.env` (`AIza...`).
    - Add `NEXT_PUBLIC_API_URL`: Paste your **Render Backend URL** (from Part 2) WITHOUT the trailing slash (e.g., `https://commercecast-api.onrender.com`).
5. **Deploy**:
    - Click **"Deploy"**.
    - Vercel will build your app (approx. 1 minute).
    - Once done, you will see a "Congratulations!" screen with your live website URL (e.g., `https://commercecast.vercel.app`).

---

## Troubleshooting

### Backend (Render)

- **Deployment Failed**: Check the "Logs" tab in Render.
- **"ModuleNotFound"**: Ensure `requirements.txt` is in `python-backend/` and contains all libraries (fastapi, uvicorn, etc.).
- **"Port" issues**: Ensure your start command uses `$PORT` (Render sets this dynamically).

### Frontend (Vercel)

- **Build Failed**: Check logs. If it's a type error, we might need to relax TypeScript checks in `next.config.ts`.
- **"API Connection Error"**:
  - Check the browser console (F12) on your live site.
  - If you see `CORS` errors, you need to add your Vercel URL to the `allow_origins` list in `python-backend/main.py` (currently it allows `*` which is fine for testing but check if it was changed).
  - Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel settings.

---

## Optimizations Already Applied

- **Gzip Compression**: Enabled for faster loading.
- **Tree Shaking**: Configured for `lucide-react` and `radix-ui`.
- **Lazy Loading**: Tour guide loads only when needed.

---

## Managing Previous Deployments

If you have deployed this project to Vercel before:

1. **Same Repository**: If you are using the **same** GitHub repository, you don't need to do anything special. Just `git push` your latest changes, and Vercel will automatically detect the update and redeploy the new version.
2. **New Repository**: If you created a **new** GitHub repository for this cleanup:
    - Go to your Vercel Dashboard.
    - Check if you have an old project connected to the old repo.
    - You can **Delete** the old project in Vercel settings to avoid confusion (Settings -> General -> Delete Project).
    - Follow the "Frontend Deployment" steps above to connect your **new** repo.
