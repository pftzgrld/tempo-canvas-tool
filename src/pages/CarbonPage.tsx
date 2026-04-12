import { useState, useMemo } from "react";
import { JURISDICTIONS, GROUPS, JURISDICTION_MAP, shortName, formatMW, formatKt } from "@/lib/jurisdictions";
import { calculateEmissions, BASE_YEAR } from "@/lib/carbon-calc";
import { CumulativeChart } from "@/components/carbon/CumulativeChart";
import { ArrowRight } from "lucide-react";

const SCENARIO_COLORS = ["#E84C3D", "#F28B80", "#6B6B6B"] as const;
const SCENARIO_LABELS = ["A", "B", "C"] as const;
const DC_SIZES = [10, 25, 50, 100, 250, 500, 1000, 2000, 5000, 10000];
const DEFAULT_SELECTIONS = ["ie", "solar_bess", "gas_ccgt"];

export default function CarbonPage() {
  const [selections, setSelections] = useState<(string | null)[]>(DEFAULT_SELECTIONS);
  const [dcSizeIndex, setDcSizeIndex] = useState(3);
  const [pue, setPue] = useState(1.30);
  const [lifecycle, setLifecycle] = useState(25);
  const [gridDecarb, setGridDecarb] = useState(0);

  const dcSizeMW = DC_SIZES[dcSizeIndex];

  const results = useMemo(() => {
    return selections.map((id) => {
      if (!id) return null;
      return calculateEmissions(id, dcSizeMW, pue, lifecycle, gridDecarb);
    });
  }, [selections, dcSizeMW, pue, lifecycle, gridDecarb]);

  const activeScenarios = selections
    .map((id, i) => (id && results[i] ? { id, index: i, result: results[i]!, jurisdiction: JURISDICTION_MAP[id] } : null))
    .filter(Boolean) as { id: string; index: number; result: NonNullable<(typeof results)[0]>; jurisdiction: (typeof JURISDICTION_MAP)[string] }[];

  const sortedForBars = [...activeScenarios].sort((a, b) => b.result.totalKt - a.result.totalKt);
  const worstScenario = sortedForBars[0];
  const bestScenario = sortedForBars[sortedForBars.length - 1];
  const hasSavings = activeScenarios.length >= 2 && worstScenario && bestScenario && worstScenario.result.totalKt !== bestScenario.result.totalKt;
  const savingsDelta = hasSavings ? worstScenario.result.totalKt - bestScenario.result.totalKt : 0;
  const savingsPercent = hasSavings ? Math.round((savingsDelta / worstScenario.result.totalKt) * 100) : 0;

  const setSelection = (index: number, value: string | null) => {
    const next = [...selections];
    next[index] = value;
    setSelections(next);
  };

  return (
    <div style={{ background: "#FAF8F5" }} className="min-h-screen">
      {/* Shared header from hutchins-header.css */}
      <header className="hutchins-header">
        <div className="hutchins-header-inner">
          <div className="hutchins-header-pill">
            <div className="hutchins-header-left">
              <span className="hutchins-header-brand">Hutchins Climate Capital</span>
              <div className="hutchins-header-divider" />
              <span className="hutchins-header-subtitle">Data Centre Emissions</span>
            </div>
          </div>
        </div>
      </header>

      <main className="hutchins-container" style={{ paddingTop: 16, paddingBottom: 16, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Hero — minimal */}
        <section className="text-center flex flex-col items-center gap-1 pt-1 pb-0">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, color: "#1A1A1A", lineHeight: 1.15 }}>
            Data Centre{" "}
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "#E84C3D" }}>Emissions</span>
          </h1>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "rgba(26,26,26,0.8)", maxWidth: 640, lineHeight: 1.5 }}>
            Lifetime Scope 2 emissions across grid-connected and islanded power scenarios.
          </p>
        </section>

        {/* Scenario Cards — compact, inline */}
        <section className="w-full">
          <div className="flex flex-wrap gap-3">
            {SCENARIO_LABELS.map((label, i) => {
              const sel = selections[i];
              const result = results[i];
              const isActive = !!sel;

              return (
                <div
                  key={label}
                  className="flex-1 min-w-[220px] rounded-2xl p-4 transition-all duration-300"
                  style={{
                    background: isActive ? "rgba(255, 255, 255, 0.90)" : "rgba(255, 255, 255, 0.60)",
                    boxShadow: isActive
                      ? "rgba(0,0,0,0.1) 0px 20px 25px -5px, rgba(0,0,0,0.1) 0px 8px 10px -6px"
                      : "rgba(0,0,0,0.05) 0px 20px 25px -5px, rgba(0,0,0,0.04) 0px 8px 10px -6px",
                    border: isActive
                      ? "1px solid hsla(5, 82%, 56%, 0.15)"
                      : "1px solid rgba(26, 26, 26, 0.05)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-semibold"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        background: SCENARIO_COLORS[i],
                        color: "#fff",
                      }}
                    >
                      {label}
                    </span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: "#595959" }}>
                      Scenario {label}
                    </span>
                  </div>

                  <select
                    value={sel || ""}
                    onChange={(e) => setSelection(i, e.target.value || null)}
                    className="w-full rounded-xl px-3 py-2 text-sm cursor-pointer"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      background: "#F5F3EF",
                      border: "1px solid hsla(0, 0%, 10%, 0.08)",
                      color: "#1A1A1A",
                      outline: "none",
                    }}
                  >
                    <option value="">— Select jurisdiction —</option>
                    {GROUPS.map((g) => (
                      <optgroup key={g.key} label={g.label}>
                        {JURISDICTIONS.filter((j) => j.group === g.key).map((j) => (
                          <option key={j.id} value={j.id}>
                            {j.name} ({j.intensity} gCO₂/kWh)
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>

                  {result && (
                    <div className="mt-3">
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: SCENARIO_COLORS[i] }}>
                        {formatKt(result.totalKt)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Chart + Parameters — side by side */}
        <section className="w-full flex flex-col lg:flex-row gap-5">
          {/* Chart — takes most space */}
          <div className="flex-1 min-w-0">
            <CumulativeChart
              activeScenarios={activeScenarios.map((s) => ({
                label: SCENARIO_LABELS[s.index],
                color: SCENARIO_COLORS[s.index],
                result: s.result,
                name: s.jurisdiction.name,
              }))}
              lifecycle={lifecycle}
            />
          </div>

          {/* Parameters — sidebar */}
          <div
            className="lg:w-[280px] shrink-0 rounded-2xl p-5"
            style={{
              background: "rgba(255, 255, 255, 0.90)",
              border: "1px solid rgba(26, 26, 26, 0.05)",
              boxShadow: "rgba(0,0,0,0.05) 0px 20px 25px -5px, rgba(0,0,0,0.04) 0px 8px 10px -6px",
            }}
          >
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "#595959", marginBottom: 20 }}>
              FACILITY PARAMETERS
            </div>
            <div className="flex flex-col gap-5">
              <SliderParam
                label="DC Size"
                value={formatMW(dcSizeMW)}
                note={`Total draw: ${formatMW(Math.round(dcSizeMW * pue))}`}
                min={0}
                max={DC_SIZES.length - 1}
                step={1}
                rawValue={dcSizeIndex}
                onChange={setDcSizeIndex}
              />
              <SliderParam
                label="PUE"
                value={pue.toFixed(2)}
                note="Total facility power ÷ IT power"
                min={1.05}
                max={1.80}
                step={0.05}
                rawValue={pue}
                onChange={setPue}
              />
              <SliderParam
                label="Lifecycle"
                value={`${lifecycle} yr`}
                note={`${BASE_YEAR}–${BASE_YEAR + lifecycle}`}
                min={15}
                max={35}
                step={1}
                rawValue={lifecycle}
                onChange={setLifecycle}
              />
              <SliderParam
                label="Grid Decarb"
                value={`${gridDecarb.toFixed(1)}%`}
                note="Grid sources only — islanded holds constant"
                min={0}
                max={5}
                step={0.5}
                rawValue={gridDecarb}
                onChange={setGridDecarb}
              />
            </div>
          </div>
        </section>

        {/* Lifetime Totals */}
        {activeScenarios.length >= 2 && (
          <section className="w-full rounded-2xl p-6" style={{ background: "rgba(255, 255, 255, 0.90)", border: "1px solid rgba(26, 26, 26, 0.05)", boxShadow: "rgba(0,0,0,0.05) 0px 20px 25px -5px, rgba(0,0,0,0.04) 0px 8px 10px -6px" }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "#595959", marginBottom: 16 }}>
              LIFETIME TOTALS
            </div>
            <div className="flex flex-col gap-3">
              {sortedForBars.map((s) => {
                const maxTotal = sortedForBars[0].result.totalKt;
                const pct = (s.result.totalKt / maxTotal) * 100;
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-semibold shrink-0"
                      style={{ background: SCENARIO_COLORS[s.index], color: s.index === 1 ? "#1A1A1A" : "#fff", fontFamily: "'Inter', sans-serif" }}
                    >
                      {SCENARIO_LABELS[s.index]}
                    </span>
                    <span className="w-36 truncate shrink-0" style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "#1A1A1A" }}>
                      {shortName(s.jurisdiction.name)}
                    </span>
                    <div className="flex-1 h-2 rounded-full" style={{ background: "#F5F3EF" }}>
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, background: SCENARIO_COLORS[s.index], opacity: 0.85 }}
                      />
                    </div>
                    <span className="shrink-0 w-20 text-right" style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: "#1A1A1A" }}>
                      {formatKt(s.result.totalKt)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Savings Callout */}
        {hasSavings && (
          <section
            className="w-full rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            style={{ background: "hsla(5, 82%, 56%, 0.10)" }}
          >
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "#E84C3D", marginBottom: 8 }}>
                AVOIDABLE EMISSIONS
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 3vw, 36px)", fontWeight: 700, color: "#E84C3D" }}>
                {formatKt(savingsDelta)}
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "#595959", marginTop: 8, lineHeight: 1.6, maxWidth: 480 }}>
                Switching from {shortName(worstScenario.jurisdiction.name)} to {shortName(bestScenario.jurisdiction.name)} avoids {savingsPercent}% of lifetime Scope 2 emissions.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-center">
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: SCENARIO_COLORS[worstScenario.index] }}>
                  {formatKt(worstScenario.result.totalKt)}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#595959" }}>
                  {shortName(worstScenario.jurisdiction.name)}
                </div>
              </div>
              <ArrowRight className="w-5 h-5" style={{ color: "#595959" }} />
              <div className="text-center">
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: SCENARIO_COLORS[bestScenario.index] }}>
                  {formatKt(bestScenario.result.totalKt)}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#595959" }}>
                  {shortName(bestScenario.jurisdiction.name)}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Methodology Footer */}
        <section className="w-full">
          <div style={{ borderLeft: "2px solid #E84C3D", paddingLeft: 12 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontStyle: "italic", color: "#1A1A1A", opacity: 0.6, lineHeight: 1.7 }}>
              Energy = DC size × PUE × 8,760h × 95% utilisation. Emissions = energy × carbon intensity (Scope 2, location-based). Grid decarb reduces intensity annually for grid-connected sources; islanded sources hold constant. Embodied carbon not included.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: "#595959", marginTop: 8 }}>
              Sources: IEA, EPA eGRID, EMBER
            </p>
          </div>
        </section>
      </main>

      <footer className="hutchins-footer">
        <div className="hutchins-footer-inner">
          <div>
            <div className="hutchins-footer-brand">Hutchins Climate Capital</div>
            <div className="hutchins-footer-copy">&copy; 2026 Hutchins Climate Capital Ltd.</div>
          </div>
          <div className="hutchins-footer-links">
            <a href="https://hutchinsclimate.com">hutchinsclimate.com</a>
            <a href="https://hutchinsclimate.com/terms">Terms</a>
            <a href="https://hutchinsclimate.com/privacy">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SliderParam({
  label, value, note, min, max, step, rawValue, onChange,
}: {
  label: string; value: string; note: string;
  min: number; max: number; step: number;
  rawValue: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "#595959" }}>
          {label}
        </span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 500, color: "#1A1A1A" }}>
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={rawValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full carbon-slider"
        style={{ accentColor: "#E84C3D" }}
      />
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#6B6B6B", marginTop: 4 }}>
        {note}
      </p>
    </div>
  );
}
