# Recommendation Engine Sandbox
**Real Rails Intelligence Library — PoC #49 | Distribution & Demand**

> Turns abstract algorithm talk into something inspectable. For everyday viewers, builders, and allocators.

---

## Quick Start

### Backend
```bash

python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate
cd backend   
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Swagger docs → http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App → http://localhost:3000

> **If the backend is offline**, the frontend automatically switches to mock data. The UI never breaks.

---

## What's Inside

| Tab | What it does |
|---|---|
| Preference Sliders | Drag 5 signal weights — rankings recompute live |
| Model Score View | Click any bar to see inside that item's score breakdown |
| Bias Feedback Loop | Click items to simulate engagement, watch Gini inequality rise |
| Content Outcomes | Scatter plot: does quality predict exposure? |
| Reset Scenarios | Load real-world presets (TikTok, BBC, Netflix, etc.) |

---

## Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, ECharts, Recharts, TanStack Table
- **Backend**: FastAPI, Pandas, DuckDB, NumPy
- **Data**: Synthetic 100-user × 24-item interaction matrix · GDELT [mock] · Our World in Data [mock]

---

## Real Rails DNA Check
| | |
|---|---|
| Background | `#030712` ✅ |
| Layout | 70% Main / 30% Sidebar ✅ |
| Filters | No page refresh ✅ |
| Mock fallback | Auto-switches if API offline ✅ |
| No hardcoded keys | `.env` only ✅ |
