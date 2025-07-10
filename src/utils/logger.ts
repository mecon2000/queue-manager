// Simple logger utility. Replace with a more robust logger (e.g., winston) for production.
export const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
};
