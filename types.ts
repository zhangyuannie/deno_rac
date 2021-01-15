export interface MePerfs {
  accept_pms: "everyone" | "whitelisted";
  mark_messages_read: boolean;
  // deno-lint-ignore no-explicit-any
  [k: string]: any;
}
