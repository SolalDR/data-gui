export const computeStep = (value: number, max?: number): number => {
  if (max) return max / 100
  if (Math.abs(value) < 1 && value !== 0) return 0.001
  if (Math.abs(value) < 10 || value === 0) return 0.1
  return 1
}