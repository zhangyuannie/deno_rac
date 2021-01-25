import type { RedditListing, RequestOptions } from "./types.ts";
import { backoff as defaultBackoff, CacheSet } from "./util.ts";

type ListingGetter<T> = (params: RequestOptions) => Promise<RedditListing<T>>;
interface CreateStreamOptions {
  backoff?: (attempt: number) => Promise<void>;
  limit?: number;
}

export async function* createStream<T extends { name: string }>(
  request: ListingGetter<T>,
  { backoff = defaultBackoff, limit = 64 }: CreateStreamOptions = {},
) {
  const seen = new CacheSet(limit * 2);
  let before: string | undefined;
  let attempts = 0;
  // populate seen
  await request({ params: { limit: `${limit}`, before } })
    .then((listing) => listing.data.children)
    .then((things) => things.forEach((thing) => seen.add(thing.data.name)));

  while (true) {
    const things = await request({ params: { limit: `${limit}`, before } })
      .then((listing) => listing.data.children);
    before = undefined;
    for (let i = things.length; i--;) {
      const thing = things[i];
      if (seen.has(thing.data.name)) continue;
      before = thing.data.name;
      seen.add(thing.data.name);
      yield thing;
    }
    if (before) {
      attempts = 0;
    } else {
      await backoff(attempts);
      attempts++;
    }
  }
}
