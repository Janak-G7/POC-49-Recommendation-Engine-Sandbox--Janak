# Recommendation Engine Sandbox
### Real Rails Intelligence Library — PoC #49 | Distribution & Demand

> Turns abstract algorithm talk into something inspectable. Explore how recommendation systems rank, distribute attention, amplify engagement, and shape content visibility in real time.

---

## Overview

Recommendation Engine Sandbox is an interactive recommendation-system simulator designed to expose the mechanics behind modern ranking algorithms.

Users can modify ranking signals, inspect score calculations, simulate engagement loops, and observe how algorithmic choices affect exposure, fairness, and content distribution.

---

## Quick Start

### Backend

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

cd backend

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

## Offline Resilience

If the backend becomes unavailable:

- runs on synthetic data
- No application crashes
- UI remains interactive
- Charts continue rendering
- Existing state preserved

The application remains fully usable.

---

## Features

| Feature | Description |
|----------|----------|
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
|------|---------|
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
rempomix-output.xml
```

---

## Real Rails DNA Check

| Requirement | Status |
|-------------|---------|
| Background #030712 | ✅ |
| 70/30 Layout | ✅ |
| No Page Refresh | ✅ |
| Live Recalculation | ✅ |
| Offline Fallback | ✅ |
| Mock Data Support | ✅ |
| Environment Variables Only | ✅ |
| Explainable Rankings | ✅ |

---

## Proof of Concept

**PoC ID:** 49

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
