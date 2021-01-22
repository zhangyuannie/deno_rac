export interface RequestOptions {
  body?: Record<string, string>;
  headers?: Record<string, string>;
  method?: RequestInit["method"];
  /** @default true */
  useOauth?: boolean;
  /** The query string, by default raw_json is set to 1 */
  params?: Record<string, string | undefined>;
  /**
   * If `true`, the body will be sent as json
   * @default false
   */
  json?: boolean;
}

export interface Requester {
  request(uri: string, options?: RequestOptions): Promise<Response>;
}

export interface MePerfs {
  accept_pms: "everyone" | "whitelisted";
  mark_messages_read: boolean;
  // deno-lint-ignore no-explicit-any
  [k: string]: any;
}

export interface RedditThing<T> {
  id: string;
  name: string;
  kind: string;
  data: T;
}

export interface RedditVotable {
  ups: number;
  downs: number;
  likes: boolean | null;
}

export interface RedditCreated {
  created: number;
  created_utc: number;
}

export interface RedditLink extends RedditCreated, RedditVotable {
  author: string;
  hidden: boolean;
  score: number;
  subreddit: string;
  subreddit_id: string;
  title: string;
  name: string;
  // deno-lint-ignore no-explicit-any
  [k: string]: any;
}

export interface RedditListing<T> {
  kind: "Listing";
  data: {
    modhash: string | null;
    children: RedditThing<T>[];
    before: string | null;
    after: string | null;
  };
}
