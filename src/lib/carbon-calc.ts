import { JURISDICTION_MAP, ISLANDED_IDS } from "./jurisdictions";

const CAPACITY_FACTOR = 0.95;
const HOURS_PER_YEAR = 8760;
export const BASE_YEAR = 2025;

export interface EmissionsResult {
  years: number[];
  cumulative: number[]; // kt CO₂
  totalKt: number;
}

export function calculateEmissions(
  jurisdictionId: string,
  dcSizeMW: number,
  pue: number,
  lifecycleYears: number,
  gridDecarbPercent: number
): EmissionsResult {
  const jurisdiction = JURISDICTION_MAP[jurisdictionId];
  if (!jurisdiction) return { years: [], cumulative: [], totalKt: 0 };

  const annualEnergyMWh = dcSizeMW * pue * HOURS_PER_YEAR * CAPACITY_FACTOR;
  const baseIntensity = jurisdiction.intensity; // gCO₂/kWh
  const isIslanded = ISLANDED_IDS.has(jurisdictionId);
  const decarbRate = isIslanded ? 0 : gridDecarbPercent;

  const years: number[] = [];
  const cumulative: number[] = [];
  let runningTotal = 0;

  for (let y = 0; y < lifecycleYears; y++) {
    const adjustedIntensity = baseIntensity * Math.pow(1 - decarbRate / 100, y);
    // annualEnergyMWh * 1000 = kWh, * adjustedIntensity gCO₂/kWh = gCO₂
    // / 1e9 = kt CO₂
    const annualKt = (annualEnergyMWh * 1000 * adjustedIntensity) / 1e9;
    runningTotal += annualKt;
    years.push(BASE_YEAR + y);
    cumulative.push(runningTotal);
  }

  return { years, cumulative, totalKt: runningTotal };
}
