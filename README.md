# Recommendation Engine Sandbox
### Real Rails Intelligence Library — Distribution & Demand

> Turns abstract algorithm talk into something inspectable. Explore how recommendation systems rank, distribute attention, amplify engagement, and shape content visibility in real time.

---

## Overview

Recommendation Engine Sandbox is an interactive recommendation-system simulator designed to expose the mechanics behind modern ranking algorithms.

Users can modify ranking signals, inspect score calculations, simulate engagement loops, and observe how algorithmic choices affect exposure, fairness, and content distribution.

---

## Quick Start

### Backend

> Run all backend commands from inside the `backend/` directory.

**Windows (PowerShell)**

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
copy .env.example .env.local
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**macOS / Linux**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
cp .env.example .env.local
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Swagger Docs:

```text
http://localhost:8000/docs
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Application:

```text
http://localhost:3000
```

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `source : The term 'source' is not recognized` | Using the macOS/Linux activation command on Windows | Use `.\venv\Scripts\activate` instead |
| `Unable to create process using ... venv\Scripts\python.exe` | The virtual environment was created in a different folder and then moved or renamed | Delete the `venv` folder and recreate it in the current directory with `python -m venv venv` |
| `running scripts is disabled on this system` | PowerShell execution policy blocks venv activation | Run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, then activate again |
| `python` is not recognized (Windows) | Python launcher not on PATH | Use `py -m venv venv` instead of `python -m venv venv` |
| `ModuleNotFoundError` when running uvicorn | Dependencies installed outside the active venv | Confirm `(venv)` appears in your prompt, then re-run `pip install -r requirements.txt` |
| Port 8000 already in use | Another process is bound to the port | Start on a different port: `uvicorn main:app --reload --port 8001` |
| Frontend cannot reach the backend | Backend not running, or running on a non-default port | Start the backend, or set `NEXT_PUBLIC_API_URL` to the correct address |
| `npm install` fails | Stale or partial dependency cache | Delete `node_modules` and `package-lock.json`, then run `npm install` again |

---

## Offline Resilience

If the backend becomes unavailable, the frontend automatically falls back to synthetic data:

- Runs on synthetic data
- No application crashes
- UI remains interactive
- Charts continue rendering
- Existing state preserved

The application remains fully usable.

---

## Features

| Feature | Description |
|---------|-------------|
| Preference Sliders | Adjust ranking signal weights in real time |
| Live Ranking Engine | Rankings update instantly |
| Score Inspector | View recommendation score breakdowns |
| Bias Feedback Loop | Simulate engagement amplification |
| Exposure Analytics | Visualize attention distribution |
| Content Outcomes | Compare quality vs exposure |
| Scenario Presets | Load platform-inspired recommendation models |
| Explainability Layer | Inspect ranking decisions |
| Mock Data Fallback | Automatic offline support |

---

## What's Inside

| Tab | Purpose |
|-----|---------|
| Preference Sliders | Tune ranking weights |
| Model Score View | Inspect scoring calculations |
| Bias Feedback Loop | Observe algorithmic reinforcement |
| Content Outcomes | Analyze exposure vs quality |
| Scenario Presets | Compare recommendation strategies |

---

## Technology Stack

### Frontend

- Next.js 14
- TypeScript
- Tailwind CSS
- ECharts
- Recharts
- TanStack Table

### Backend

- FastAPI
- Pandas
- NumPy
- DuckDB

### Data

- Synthetic 100 User × 24 Item Interaction Dataset
- Mock GDELT Integration
- Mock Our World in Data Integration

---

## Project Structure

```text
backend/
├── main.py
├── requirements.txt
└── .env.example

frontend/
├── app/
├── components/
├── hooks/
├── lib/
├── package.json
└── tailwind.config.ts

README.md
repomix.config.json
```

---

## Real Rails DNA Check

| Requirement | Status |
|-------------|--------|
| Background #030712 | ✅ |
| 70/30 Layout | ✅ |
| No Page Refresh | ✅ |
| Live Recalculation | ✅ |
| Offline Fallback | ✅ |
| Mock Data Support | ✅ |
| Environment Variables Only | ✅ |
| Explainable Rankings | ✅ |

---

## Theme

**Theme:** Distribution & Demand

**Focus Areas:**
- Recommendation Systems
- Exposure Distribution
- Ranking Explainability
- Feedback Loops
- Algorithmic Fairness
- Content Discovery

---

## License

Educational and demonstration purposes.
