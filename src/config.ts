import dotenv from 'dotenv';
dotenv.config();

// Default timeout for queue polling (in milliseconds)
export const DEFAULT_TIMEOUT_MS = process.env.DEFAULT_TIMEOUT_MS
  ? parseInt(process.env.DEFAULT_TIMEOUT_MS, 10)
  : 10000;
