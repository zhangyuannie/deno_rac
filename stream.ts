import type { RedditListing, RequestOptions } from "./types.ts";
import { backoff } from "./util.ts";

type ListingGetter<T> = (params: RequestOptions) => Promise<RedditListing<T>>;
interface CreateStreamOptions {
  backoff?: (attempt: number) => Promise<void>;
  limit?: number;
}

export async function* createStream<T extends { name: string }>(
  request: ListingGetter<T>,
  options: CreateStreamOptions = { backoff },
) {
  let before: string | undefined;
  const limit = `${options.limit ?? 64}`;
  let attempts = 0;
  const seen = new Set();
  while (true) {
    const things = await request({ params: { limit, before } })
      .then((l) => l.data.children);
    console.log(things.length);
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
