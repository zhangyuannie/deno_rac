import { delay } from "./deps.ts";

/**
 * Exponential backoff with full jitter, the wait time will max out at 9
 * attempts (around 1 min)
 */
export function backoff(attempts: number) {
  if (attempts > 8) attempts = 8;
  return delay((2 ** attempts - 1) * 256 * Math.random());
}

/**
 * Set with a maximum size for internal use
 */
export class CacheSet<T> {
  #size: number;
  #set = new Set<T>();

  get size() {
    return this.#size;
  }

  constructor(size: number) {
    this.#size = Math.floor(size);
  }

  has(value: T) {
    if (this.#set.delete(value)) {
      this.#set.add(value);
      return true;
    }
    return false;
  }

  add(value: T) {
    this.#set.add(value);
    if (this.#set.size > this.#size) {
      const first = this.#set.values().next().value;
      this.#set.delete(first);
    }
  }
}
