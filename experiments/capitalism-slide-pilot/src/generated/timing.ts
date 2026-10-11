export const TIMING = [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6] as const;
export const TOTAL_SECONDS = TIMING.reduce((sum, value) => sum + value, 0);
