import { assert, assertEquals } from "./deps.ts";
import { CacheSet } from "./util.ts";
Deno.test("CacheSet", () => {
  const set = new CacheSet(2);
  set.add(1);
  set.add(2);
  assert(set.has(1));
  assert(set.has(2));
  assert(!set.has(3));
  set.add(3);
  assert(set.has(3));
  assert(!set.has(1));
});
