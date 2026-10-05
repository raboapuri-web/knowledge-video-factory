export const TIMING = [
  8, 7, 8, 9, 9, 8, 8, 8, 10
] as const;
export const TOTAL_SECONDS = TIMING.reduce((sum, value) => sum + value, 0);
