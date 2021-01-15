export interface RequestOptions {
  body?: Record<string, string>;
  headers?: Record<string, string>;
  method?: RequestInit["method"];
  /** @default true */
  useOauth?: boolean;
  /** The query string, by default raw_json is set to 1 */
  params?: Record<string, string>;
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
