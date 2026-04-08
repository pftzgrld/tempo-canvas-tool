export interface Jurisdiction {
  id: string;
  name: string;
  intensity: number; // gCO₂/kWh
  group: string;
}

export const JURISDICTIONS: Jurisdiction[] = [
  // United States
  { id: "us_caiso", name: "US — CAISO / California", intensity: 194, group: "United States" },
  { id: "us_ercot", name: "US — ERCOT / Texas", intensity: 333, group: "United States" },
  { id: "us_isone", name: "US — ISO-NE / New England", intensity: 245, group: "United States" },
  { id: "us_miso", name: "US — MISO / Midwest", intensity: 417, group: "United States" },
  { id: "us_nyiso", name: "US — NYISO / New York", intensity: 250, group: "United States" },
  { id: "us_pjm", name: "US — PJM / Mid-Atlantic", intensity: 271, group: "United States" },
  { id: "us_spp", name: "US — SPP / South Central", intensity: 395, group: "United States" },
  { id: "us_wecc_nw", name: "US — WECC / Pacific NW", intensity: 287, group: "United States" },
  // Europe
  { id: "at", name: "Austria — Vienna", intensity: 69, group: "Europe" },
  { id: "be", name: "Belgium — Brussels", intensity: 110, group: "Europe" },
  { id: "dk", name: "Denmark", intensity: 173, group: "Europe" },
  { id: "fi", name: "Finland", intensity: 83, group: "Europe" },
  { id: "fr", name: "France — Paris / Marseille", intensity: 22, group: "Europe" },
  { id: "de", name: "Germany — Frankfurt", intensity: 321, group: "Europe" },
  { id: "ie", name: "Ireland", intensity: 256, group: "Europe" },
  { id: "it", name: "Italy — Milan", intensity: 270, group: "Europe" },
  { id: "nl", name: "Netherlands — Amsterdam", intensity: 370, group: "Europe" },
  { id: "no", name: "Norway", intensity: 18, group: "Europe" },
  { id: "pl", name: "Poland — Warsaw", intensity: 652, group: "Europe" },
  { id: "pt", name: "Portugal — Lisbon", intensity: 80, group: "Europe" },
  { id: "es", name: "Spain — Madrid", intensity: 108, group: "Europe" },
  { id: "se", name: "Sweden", intensity: 18, group: "Europe" },
  { id: "ch", name: "Switzerland — Zurich", intensity: 30, group: "Europe" },
  { id: "uk", name: "United Kingdom", intensity: 124, group: "Europe" },
  // Asia-Pacific
  { id: "au_nsw", name: "Australia — NSW / Sydney", intensity: 466, group: "Asia-Pacific" },
  { id: "au_vic", name: "Australia — Victoria / Melbourne", intensity: 550, group: "Asia-Pacific" },
  { id: "hk", name: "Hong Kong", intensity: 390, group: "Asia-Pacific" },
  { id: "in", name: "India — Mumbai / Chennai", intensity: 700, group: "Asia-Pacific" },
  { id: "id", name: "Indonesia — Jakarta", intensity: 625, group: "Asia-Pacific" },
  { id: "jp", name: "Japan — Tokyo", intensity: 416, group: "Asia-Pacific" },
  { id: "my", name: "Malaysia — Johor", intensity: 538, group: "Asia-Pacific" },
  { id: "sg", name: "Singapore", intensity: 402, group: "Asia-Pacific" },
  { id: "kr", name: "South Korea — Seoul", intensity: 396, group: "Asia-Pacific" },
  { id: "tw", name: "Taiwan", intensity: 474, group: "Asia-Pacific" },
  // Middle East
  { id: "il", name: "Israel — Tel Aviv", intensity: 502, group: "Middle East" },
  { id: "qa", name: "Qatar — Doha", intensity: 489, group: "Middle East" },
  { id: "sa", name: "Saudi Arabia — NEOM / Riyadh", intensity: 543, group: "Middle East" },
  { id: "ae", name: "UAE — Dubai / Abu Dhabi", intensity: 359, group: "Middle East" },
  // Americas (ex-US)
  { id: "br", name: "Brazil — São Paulo", intensity: 109, group: "Americas (ex-US)" },
  { id: "ca_ab", name: "Canada — Alberta", intensity: 470, group: "Americas (ex-US)" },
  { id: "ca_on", name: "Canada — Ontario", intensity: 74, group: "Americas (ex-US)" },
  { id: "ca_qc", name: "Canada — Québec", intensity: 2, group: "Americas (ex-US)" },
  { id: "cl", name: "Chile — Santiago", intensity: 228, group: "Americas (ex-US)" },
  { id: "mx", name: "Mexico — Querétaro", intensity: 412, group: "Americas (ex-US)" },
  // Islanded (Off-Grid)
  { id: "diesel", name: "Islanded Diesel Genset", intensity: 700, group: "Islanded (Off-Grid)" },
  { id: "gas_ccgt", name: "Islanded Gas (CCGT)", intensity: 430, group: "Islanded (Off-Grid)" },
  { id: "gas_ocgt", name: "Islanded Gas (OCGT / Peaker)", intensity: 570, group: "Islanded (Off-Grid)" },
  { id: "hybrid_gas_solar", name: "Islanded Gas + Solar Hybrid", intensity: 280, group: "Islanded (Off-Grid)" },
  { id: "nuclear", name: "Islanded Nuclear (SMR)", intensity: 13, group: "Islanded (Off-Grid)" },
  { id: "solar_bess", name: "Islanded Solar + BESS", intensity: 48, group: "Islanded (Off-Grid)" },
  { id: "wind_bess", name: "Islanded Wind + BESS", intensity: 20, group: "Islanded (Off-Grid)" },
];

export const JURISDICTION_MAP = Object.fromEntries(JURISDICTIONS.map(j => [j.id, j]));

export const GROUPS = [...new Set(JURISDICTIONS.map(j => j.group))];

export const ISLANDED_IDS = new Set(
  JURISDICTIONS.filter(j => j.group === "Islanded (Off-Grid)").map(j => j.id)
);

export function shortName(name: string): string {
  return name
    .replace(/^US — [A-Z-]+ \/ /, "")
    .replace(/^Islanded /, "")
    .replace(/ — .+$/, "");
}

export function formatMW(mw: number): string {
  return mw >= 1000 ? `${mw / 1000} GW` : `${mw} MW`;
}

export function formatKt(kt: number): string {
  if (kt >= 1000) return `${Math.round(kt / 1000)} Mt`;
  if (kt < 1) return `${Math.round(kt * 1000)} t`;
  return `${Math.round(kt)} kt`;
}
