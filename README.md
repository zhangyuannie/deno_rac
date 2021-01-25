# rac

A module that allows you to interact with Reddit's API.

**This is still a work in progress.**

## Usage

Import this module and create a new instance with your credentials:

```ts
import { Client } from "https://deno.land/x/rac/mod.ts";

const api = new Client({
  clientId: "your client ID",
  clientSecret: "your client secret",
  refreshToken: "your refresh token",
  userAgent: "deno:my_app:v0.1.0",
});
```

Access Reddit's API:

```ts
// get user's karma
const karmaList = await api.me.karma.get();

// turn nightmode off
api.me.prefs.patch({ nightmode: false });
```

Send raw request directly:

```ts
// get the listing of the best 5 posts
const listing = await api
  .request("/best", { params: { limit: "5" } })
  .then((res) => res.json());
```

Monitor new submissions:

```ts
// for every new post in r/AskReddit, log its title
for await (const link of api.r("AskReddit").new) {
  console.log(link.data.title);
}
```
