import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface ScenarioData {
  label: string;
  color: string;
  result: { years: number[]; cumulative: number[]; totalKt: number };
  name: string;
}

interface CumulativeChartProps {
  activeScenarios: ScenarioData[];
  lifecycle: number;
}

export function CumulativeChart({ activeScenarios, lifecycle }: CumulativeChartProps) {
  const chartData = useMemo(() => {
    if (activeScenarios.length === 0) return [];
    const len = lifecycle;
    const data: Record<string, number | string>[] = [];
    for (let i = 0; i < len; i++) {
      const entry: Record<string, number | string> = { year: activeScenarios[0].result.years[i] };
      activeScenarios.forEach((s) => {
        entry[s.label] = Math.round(s.result.cumulative[i] * 100) / 100;
      });
      data.push(entry);
    }
    return data;
  }, [activeScenarios, lifecycle]);

  // Sort so largest total renders first (behind)
  const sorted = useMemo(() => {
    return [...activeScenarios].sort((a, b) => b.result.totalKt - a.result.totalKt);
  }, [activeScenarios]);

  const strokeWidths = [2.5, 2, 1.5];
  const fillOpacities = [0.25, 0.18, 0.12];

  const formatY = (v: number) => {
    if (v >= 1000) return `${Math.round(v / 1000)} Mt`;
    return `${Math.round(v)} kt`;
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255, 255, 255, 0.90)",
        border: "1px solid hsla(0, 0%, 10%, 0.05)",
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 10,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "#595959",
          marginBottom: 16,
        }}
      >
        CUMULATIVE EMISSIONS
      </div>

      {activeScenarios.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p style={{ fontFamily: "'Lora', serif", fontSize: 16, color: "#595959" }}>
            Select at least one scenario above.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={380}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              {sorted.map((s, i) => (
                <linearGradient key={s.label} id={`grad-${s.label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={fillOpacities[i] ?? 0.1} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="hsla(0, 0%, 10%, 0.04)" strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fill: "#595959" }}
              axisLine={{ stroke: "hsla(0, 0%, 10%, 0.08)" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatY}
              tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fill: "#595959" }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Cumulative kt CO₂",
                angle: -90,
                position: "insideLeft",
                offset: 0,
                style: { fontFamily: "'Inter', sans-serif", fontSize: 10, fill: "#595959", textAnchor: "middle" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {sorted.map((s, i) => (
              <Area
                key={s.label}
                type="monotone"
                dataKey={s.label}
                stroke={s.color}
                strokeWidth={strokeWidths[i] ?? 1.5}
                fill={`url(#grad-${s.label})`}
                dot={false}
                activeDot={{ r: 5, fill: "#fff", stroke: s.color, strokeWidth: 2 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: "#1A1A1A",
        border: "none",
        minWidth: 160,
      }}
    >
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>
        {label}
      </div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4" style={{ marginBottom: 2 }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#fff" }}>
              {p.dataKey}
            </span>
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff" }}>
            {p.value >= 1000 ? `${Math.round(p.value / 1000)} Mt` : `${Math.round(p.value)} kt`}
          </span>
        </div>
      ))}
    </div>
  );
}
