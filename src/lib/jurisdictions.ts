export interface Jurisdiction {
  id: string;
  name: string;
  intensity: number; // gCO₂/kWh
  group: string;
}

export interface JurisdictionGroup {
  key: string;
  label: string;
}

export const JURISDICTIONS: Jurisdiction[] = [
  { id: "us_caiso", name: "US — CAISO / California", intensity: 194, group: "us" },
  { id: "us_ercot", name: "US — ERCOT / Texas", intensity: 333, group: "us" },
  { id: "us_isone", name: "US — ISO-NE / New England", intensity: 245, group: "us" },
  { id: "us_miso", name: "US — MISO / Midwest", intensity: 417, group: "us" },
  { id: "us_nyiso", name: "US — NYISO / New York", intensity: 250, group: "us" },
  { id: "us_pjm", name: "US — PJM / Mid-Atlantic", intensity: 271, group: "us" },
  { id: "us_spp", name: "US — SPP / South Central", intensity: 395, group: "us" },
  { id: "us_wecc_nw", name: "US — WECC / Pacific NW", intensity: 287, group: "us" },
  { id: "at", name: "Austria — Vienna", intensity: 69, group: "europe" },
  { id: "be", name: "Belgium — Brussels", intensity: 110, group: "europe" },
  { id: "dk", name: "Denmark", intensity: 173, group: "europe" },
  { id: "fi", name: "Finland", intensity: 83, group: "europe" },
  { id: "fr", name: "France — Paris / Marseille", intensity: 22, group: "europe" },
  { id: "de", name: "Germany — Frankfurt", intensity: 321, group: "europe" },
  { id: "ie", name: "Ireland", intensity: 256, group: "europe" },
  { id: "it", name: "Italy — Milan", intensity: 270, group: "europe" },
  { id: "nl", name: "Netherlands — Amsterdam", intensity: 370, group: "europe" },
  { id: "no", name: "Norway", intensity: 18, group: "europe" },
  { id: "pl", name: "Poland — Warsaw", intensity: 652, group: "europe" },
  { id: "pt", name: "Portugal — Lisbon", intensity: 80, group: "europe" },
  { id: "es", name: "Spain — Madrid", intensity: 108, group: "europe" },
  { id: "se", name: "Sweden", intensity: 18, group: "europe" },
  { id: "ch", name: "Switzerland — Zurich", intensity: 30, group: "europe" },
  { id: "uk", name: "United Kingdom", intensity: 124, group: "europe" },
  { id: "au_nsw", name: "Australia — NSW / Sydney", intensity: 466, group: "apac" },
  { id: "au_vic", name: "Australia — Victoria / Melbourne", intensity: 550, group: "apac" },
  { id: "hk", name: "Hong Kong", intensity: 390, group: "apac" },
  { id: "in", name: "India — Mumbai / Chennai", intensity: 700, group: "apac" },
  { id: "id", name: "Indonesia — Jakarta", intensity: 625, group: "apac" },
  { id: "jp", name: "Japan — Tokyo", intensity: 416, group: "apac" },
  { id: "my", name: "Malaysia — Johor", intensity: 538, group: "apac" },
  { id: "sg", name: "Singapore", intensity: 402, group: "apac" },
  { id: "kr", name: "South Korea — Seoul", intensity: 396, group: "apac" },
  { id: "tw", name: "Taiwan", intensity: 474, group: "apac" },
  { id: "il", name: "Israel — Tel Aviv", intensity: 502, group: "mena" },
  { id: "qa", name: "Qatar — Doha", intensity: 489, group: "mena" },
  { id: "sa", name: "Saudi Arabia — NEOM / Riyadh", intensity: 543, group: "mena" },
  { id: "ae", name: "UAE — Dubai / Abu Dhabi", intensity: 359, group: "mena" },
  { id: "br", name: "Brazil — São Paulo", intensity: 109, group: "americas" },
  { id: "ca_ab", name: "Canada — Alberta", intensity: 470, group: "americas" },
  { id: "ca_on", name: "Canada — Ontario", intensity: 74, group: "americas" },
  { id: "ca_qc", name: "Canada — Québec", intensity: 2, group: "americas" },
  { id: "cl", name: "Chile — Santiago", intensity: 228, group: "americas" },
  { id: "mx", name: "Mexico — Querétaro", intensity: 412, group: "americas" },
  { id: "diesel", name: "Islanded Diesel Genset", intensity: 700, group: "islanded" },
  { id: "gas_ccgt", name: "Islanded Gas (CCGT)", intensity: 430, group: "islanded" },
  { id: "gas_ocgt", name: "Islanded Gas (OCGT / Peaker)", intensity: 570, group: "islanded" },
  { id: "hybrid_gas_solar", name: "Islanded Gas + Solar Hybrid", intensity: 280, group: "islanded" },
  { id: "nuclear", name: "Islanded Nuclear (SMR)", intensity: 13, group: "islanded" },
  { id: "solar_bess", name: "Islanded Solar + BESS", intensity: 48, group: "islanded" },
  { id: "wind_bess", name: "Islanded Wind + BESS", intensity: 20, group: "islanded" },
];

export const GROUPS: JurisdictionGroup[] = [
  { key: "us", label: "United States" },
  { key: "europe", label: "Europe" },
  { key: "apac", label: "Asia-Pacific" },
  { key: "mena", label: "Middle East" },
  { key: "americas", label: "Americas (ex-US)" },
  { key: "islanded", label: "Islanded (Off-Grid)" },
];

export const JURISDICTION_MAP = Object.fromEntries(JURISDICTIONS.map(j => [j.id, j]));

export const ISLANDED_IDS = new Set(
  JURISDICTIONS.filter(j => j.group === "islanded").map(j => j.id)
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
