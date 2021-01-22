import type { RedditLink, RedditListing } from "./types.ts";
import { Resource } from "./resource.ts";
import { createStream } from "./stream.ts";

export class Subreddit extends Resource {
  get new() {
    return {
      get: (params: any): Promise<RedditListing<RedditLink>> =>
        this.request("/new", { params }).then((res) => res.json()),
      [Symbol.asyncIterator]: () => createStream(this.new.get, { limit: 256 }),
    };
  }
}
