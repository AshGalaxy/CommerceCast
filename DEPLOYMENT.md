# CommerceCast Deployment Guide

## 1. Frontend (Next.js)

**Recommended Platform: Vercel** (Creators of Next.js)

1. **Push to GitHub**: Ensure your code is in a GitHub repository.
2. **Import to Vercel**:
    - Go to [vercel.com](https://vercel.com) and log in.
    - Click "Add New Project" -> "Continue with GitHub".
    - Select your `CommerceCast` repository.
3. **Configure Project**:
    - **Framework Preset**: Next.js (Auto-detected)
    - **Root Directory**: `./` (default)
    - **Environment Variables**: Add keys from your `.env` file (e.g., `NEXT_PUBLIC_API_URL` if you change it from localhost).
4. **Deploy**: Click "Deploy". Vercel handles the build (`npm run build`) and hosting automatically.

## 2. Backend (FastAPI/Python)

**Recommended Platform: Render** (Easiest free tier)

1. **Push to GitHub**: Same repo as frontend.
2. **Create Service**:
    - Go to [render.com](https://render.com).
    - Click "New" -> "Web Service".
    - Connect your GitHub repo.
3. **Configure**:
    - **Root Directory**: `python-backend`
    - **Runtime**: Python 3
    - **Build Command**: `pip install -r requirements.txt`
    - **Start Command**: `python main.py` (or `uvicorn main:app --host 0.0.0.0 --port 10000`)
4. **Environment Variables**: Add any secrets (db credentials, API keys).
5. **Deploy**: Render will build and start the service.

**Note**: You will need to update the Frontend's `.env` specifically `NEXT_PUBLIC_API_URL` to point to the new Render URL (e.g., `https://commercecast-api.onrender.com`) instead of `http://localhost:8000`.

## 3. GitHub Setup

To proceed with the above, initialize your Git repository:

```powershell
git init
git add .
git commit -m "Initial commit"
# Create repo on GitHub.com then run:
git remote add origin https://github.com/YOUR_USERNAME/CommerceCast.git
git push -u origin master
```
