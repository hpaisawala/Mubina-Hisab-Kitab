// Indian number formatting
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount))
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount))
}

// Gold calculation: Net = (Gross * (Purity% / 100)) / 0.999
export function calculateNetGold(grossWeight: number, purityPercent: number): number {
  const net = (grossWeight * (purityPercent / 100)) / 0.999
  return Math.round(net * 1000) / 1000 // 3 decimal places
}

// Convert karat to percentage
export function karatToPercent(karat: number): number {
  return (karat / 24) * 100
}

// Common purity presets
export const GOLD_PRESETS = [
  { label: "24K", karat: 24, percent: 99.9 },
  { label: "22K", karat: 22, percent: 91.67 },
  { label: "21K", karat: 21, percent: 87.5 },
  { label: "18K", karat: 18, percent: 75 },
]

export function formatGoldWeight(grams: number): string {
  return `${grams.toFixed(3)} g`
}
