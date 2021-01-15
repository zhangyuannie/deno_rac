import type { Requester, RequestOptions } from "./types.ts";

export class Resource implements Requester {
  #parent: Requester;
  #uri: string;
  constructor(parent: Requester, uri: string) {
    this.#parent = parent;
    this.#uri = uri;
  }

  request(uri: string, options?: RequestOptions): Promise<Response> {
    return this.#parent.request(this.#uri + uri, options);
  }
}
