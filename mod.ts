export interface Logger {
  debug: (...data: unknown[]) => void;
  info: (...data: unknown[]) => void;
  warn: (...data: unknown[]) => void;
  error: (...data: unknown[]) => void;
}

export interface ClientOptions {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  userAgent: string;
  /**
   * The URL of Reddit's Oauth API
   * @default "https://oauth.reddit.com"
   */
  baseUrl?: string;
  /**
   * The URL to get OAuth authorization
   * @default "https://www.reddit.com"
   */
  authUrl?: string;
  /** @default console */
  log?: Logger;
}

export interface RequestOptions {
  body?: Record<string, string>;
  headers?: Record<string, string>;
  method?: RequestInit["method"];
  /** @default true */
  useOauth?: boolean;
  /** The query string, by default raw_json is set to 1 */
  params?: Record<string, string>;
}

export class Client {
  #basicAuth: string;
  #bearerAuth?: Promise<string>;
  #refreshToken: string;
  #userAgent: string;
  #baseUrl: string;
  #authUrl: string;
  #log: Logger;

  constructor(options: ClientOptions) {
    this.#basicAuth = "basic " +
      btoa(`${options.clientId}:${options.clientSecret}`);
    this.#refreshToken = options.refreshToken;
    this.#userAgent = options.userAgent;
    this.#baseUrl = options.baseUrl ?? "https://oauth.reddit.com";
    this.#authUrl = options.authUrl ?? "https://www.reddit.com";
    this.#log = options.log ?? console;
  }

  get log() {
    return this.#log;
  }

  /** Resolves to "Bearer `accessToken`" */
  bearerAuth(): Promise<string> {
    return this.#bearerAuth ?? this._updateAccessToken();
  }

  async request(uri: string, options: RequestOptions = {}): Promise<Response> {
    const useOauth = options.useOauth ?? true;
    const params = new URLSearchParams({ raw_json: "1", ...options.params });
    const url = `${useOauth ? this.#baseUrl : this.#authUrl}${uri}?${params}`;
    const init = {
      method: options.method,
      headers: {
        "User-Agent": this.#userAgent,
        "Authorization": useOauth ? await this.bearerAuth() : this.#basicAuth,
        ...options.headers,
      },
      body: options.body ? new URLSearchParams(options.body) : undefined,
    };
    return fetch(url, init)
      .then((res) => {
        if (res.status === 401) {
          this.log.info("the access token is invalid, resetting");
          this.#bearerAuth = undefined;
          return this.request(uri, options);
        }
        return res;
      });
  }

  private _updateAccessToken() {
    this.log.info("updating the access token");
    this.#bearerAuth = this.request("/api/v1/access_token", {
      method: "POST",
      useOauth: false,
      body: { grant_type: "refresh_token", refresh_token: this.#refreshToken },
    })
      .then((res) => res.json())
      .then((data) => {
        this.log.info("access token updated");
        return `Bearer ${data.access_token}`;
      });
    return this.#bearerAuth;
  }
}
