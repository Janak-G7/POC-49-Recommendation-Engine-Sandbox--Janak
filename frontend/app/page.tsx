"use client";
import { useState } from "react";
import { useRecommendations } from "./hooks/useRecommendations";
import PreferenceSliders from "./components/PreferenceSliders";
import ScoreView from "./components/ScoreView";
import BiasLoop from "./components/BiasLoop";
import OutcomesPanel from "./components/OutcomesPanel";
import ScenariosPanel from "./components/ScenariosPanel";
import Sidebar from "./components/Sidebar";
import { type Weights } from "./lib/api";

const TABS = [
  { id: "pref",      label: "Preference Sliders",   desc: "Drag weights, watch rankings change" },
  { id: "score",     label: "Model Score View",      desc: "See inside each item's score" },
  { id: "bias",      label: "Bias Feedback Loop",    desc: "Click to trigger popularity bias" },
  { id: "outcomes",  label: "Content Outcomes",      desc: "Quality vs actual exposure" },
  { id: "scenarios", label: "Reset Scenarios",       desc: "Load real-world algorithm presets" },
];

export default function Home() {
  const [dataMode, setDataMode] = useState<"synthetic" | "live">("synthetic");
  const rr = useRecommendations(dataMode);
  const [toast, setToast] = useState<string | null>(null);

  const handleScenarioLoad = (w: Weights) => {
    rr.loadScenario(w);
    setToast("✓ Scenario loaded — viewing in Preference Sliders");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{
      background: "#030712", height: "100vh",
      display: "flex", flexDirection: "column",
      fontFamily: "Inter, system-ui, sans-serif", color: "#E2E8F0",
      overflow: "hidden"
    }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{
        background: "#0B1117", borderBottom: "1px solid #1F2937",
        padding: "10px 20px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
      }}>

        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em" }}>
          Recommendation Engine Sandbox
        </span>

        <span style={{
          background: "rgba(129,140,248,0.1)", color: "#818CF8",
          fontSize: 9, fontWeight: 600, letterSpacing: "0.08em",
          padding: "2px 8px", borderRadius: 4,
          border: "0.5px solid rgba(129,140,248,0.3)", textTransform: "uppercase",
        }}>Distribution & Demand</span>

        <span style={{ fontSize: 10, color: "#64748B", marginLeft: 4 }}>
          — Turns abstract algorithm talk into something inspectable
        </span>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0, background: "#0F1923", border: "0.5px solid #1F2937", borderRadius: 6, overflow: "hidden" }}>
            {(["synthetic", "live"] as const).map(mode => (
              <button key={mode} onClick={() => setDataMode(mode)} style={{
                padding: "4px 12px", fontSize: 10, fontWeight: 600, cursor: "pointer",
                textTransform: "uppercase", letterSpacing: "0.06em", border: "none",
                background: dataMode === mode ? (mode === "live" ? "rgba(52,211,153,0.15)" : "rgba(56,189,248,0.12)") : "transparent",
                color: dataMode === mode ? (mode === "live" ? "#34D399" : "#38BDF8") : "#64748B",
                transition: "all 0.15s",
              }}>{mode}</button>
            ))}
          </div>
          {dataMode === "live" && (
            <div style={{ fontSize: 10, color: "#F59E0B", background: "rgba(245,158,11,0.1)", border: "0.5px solid rgba(245,158,11,0.3)", borderRadius: 4, padding: "3px 8px" }}>
              ⚠ Live requires backend running
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: dataMode === "live" ? "#34D399" : "#38BDF8", animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: 10, color: "#64748B" }}>Real Rails Intelligence Library</span>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────── */}
      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>

        <div style={{ flex: "0 0 70%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Tab Bar */}
          <div style={{
            display: "flex", background: "#0B1117",
            borderBottom: "1px solid #1F2937", flexShrink: 0, overflowX: "auto",
          }}>
            {TABS.map((t) => (
              <button key={t.id} onClick={() => rr.setTab(t.id)} style={{
                padding: "9px 16px", fontSize: 11, fontWeight: 500, cursor: "pointer",
                color: rr.tab === t.id ? "#38BDF8" : "#64748B",
                background: rr.tab === t.id ? "rgba(56,189,248,0.05)" : "transparent",
                borderBottom: `2px solid ${rr.tab === t.id ? "#38BDF8" : "transparent"}`,
                borderTop: "none", borderLeft: "none",
                borderRight: "0.5px solid #1F2937",
                letterSpacing: "0.03em", textTransform: "uppercase",
                whiteSpace: "nowrap", transition: "all 0.2s",
              }} title={t.desc}>{t.label}</button>
            ))}
          </div>

          {/* Panel Content — always renders, skeletons handle loading inside */}
          <div key={rr.tab} style={{ flex: 1, overflowY: "auto", padding: 16, animation: "fadeIn .7s ease both" }}>

            {rr.tab === "pref" && (
              <PreferenceSliders
                weights={rr.weights}
                onChange={rr.setWeights}
                recommendations={rr.recommendations}
                loading={rr.loading}
                category={rr.category}
                onCategoryChange={rr.setCategory}
              />
            )}

            {rr.tab === "score" && (
              <ScoreView items={rr.isLive ? rr.recommendations : rr.allItems} />
            )}

            {rr.tab === "bias" && (
              <BiasLoop
                items={rr.isLive ? rr.recommendations.map((item, i) => ({
                  id: item.id,
                  title: item.title,
                  category: item.category,
                  composite_score: item.composite_score,
                  boosted_popularity: item.base_popularity,
                  rank: i + 1,
                  click_boost: 0,
                  click_count: rr.clicks.filter(c => c === item.id).length,
                })) : rr.feedbackItems}
                clicks={rr.clicks}
                popularityGap={rr.popularityGap}
                gini={rr.gini}
                totalClicks={rr.totalClicks}
                onItemClick={rr.handleClick}
                onReset={rr.resetClicks}
              />
            )}

            {rr.tab === "scenarios" && (
              <ScenariosPanel
                scenarios={rr.scenarios}
                currentWeights={rr.weights}
                onLoad={handleScenarioLoad}
              />
            )}

            {rr.tab === "outcomes" && (
              <OutcomesPanel outcomes={rr.isLive ? (() => {
                const items = rr.recommendations;
                if (!items.length) return null;
                const total = items.reduce((s, _, i) => s + 1 / (i + 1), 0);
                const catExp: Record<string, number> = {}, catQ: Record<string, number> = {};
                items.forEach((item, i) => {
                  const exp = parseFloat(((1 / (i + 1)) / total * 100).toFixed(2));
                  catExp[item.category] = parseFloat(((catExp[item.category] || 0) + exp).toFixed(2));
                  catQ[item.category] = item.quality_score;
                });
                const scores = items.map(i => i.quality_score);
                const exposures = items.map((_, i) => parseFloat(((1 / (i + 1)) / total * 100).toFixed(2)));
                const meanQ = scores.reduce((a, b) => a + b, 0) / scores.length;
                const meanE = exposures.reduce((a, b) => a + b, 0) / exposures.length;
                const corr = scores.reduce((s, q, i) => s + (q - meanQ) * (exposures[i] - meanE), 0) /
                  Math.sqrt(scores.reduce((s, q) => s + (q - meanQ) ** 2, 0) * exposures.reduce((s, e) => s + (e - meanE) ** 2, 0) + 1e-9);
                return {
                  scatter: items.map((item, i) => ({ ...item, exposure: exposures[i] })),
                  category_exposure: catExp,
                  category_quality: catQ,
                  quality_exposure_correlation: parseFloat(corr.toFixed(3)),
                };
              })() : rr.outcomes} />
            )}
          </div>
        </div>

        <Sidebar
          avgScore={rr.avgScore}
          avgQuality={rr.avgQuality}
          topCategory={rr.topCategory}
          category={rr.category}
          onCategoryChange={rr.setCategory}
          weights={rr.weights}
          totalItems={rr.recommendations.length}
        />
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        @keyframes skeletonShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>

      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "rgba(52,211,153,0.15)",
          border: "0.5px solid rgba(52,211,153,0.5)",
          color: "#34D399",
          padding: "10px 20px", borderRadius: 8, fontSize: 12, fontWeight: 600,
          zIndex: 100, animation: "fadeIn 0.3s ease",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          whiteSpace: "nowrap",
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}