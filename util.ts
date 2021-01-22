import { delay } from "./deps.ts";

/**
 * Exponential backoff with full jitter, the wait time will max out at 9
 * attempts (around 1 min)
 */
export function backoff(attempts: number) {
  if (attempts > 8) attempts = 8;
  return delay((2 ** attempts - 1) * 256 * Math.random());
}
