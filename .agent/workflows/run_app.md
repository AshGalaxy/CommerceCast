---
description: How to run the CommerceCast application
---

1. Start the Python Backend
   - Open a terminal
   - Navigate to `python-backend`
   - Activate virtual environment (if not already active, though usually handled by IDE or user)
   - Run `python main.py` (or `uvicorn main:app --reload` if preferred, but main.py has `uvicorn.run`)

   Command:

   ```powershell
   cd python-backend
   python main.py
   ```

2. Start the Next.js Frontend
   - Open a new terminal
   - Run `npm run dev`

   Command:

   ```powershell
   npm run dev
   ```
