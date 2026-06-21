declare module 'openclaw/plugin-sdk/plugin-entry' {
  export function definePluginEntry<T extends Record<string, unknown>>(config: T): T;
}
