import type { Hook, HookCollection } from "./types.js";

/**
 * Create a hook collection. Hooks are executed in the order they are registered. The function returns
 * the updated context, which may have been modified or rerefenced by the hooks.
 * @param names The names of the hooks.
 * @returns The hook collection.
 */
export function createHookCollection<
  Hooks extends Record<string, unknown>,
>(): HookCollection<Hooks> {
  const map = new Map<string, Hook<unknown>[]>();

  const collection: HookCollection<Hooks> = {
    register: (name, ...hooks) => {
      const existing = map.get(name as string);

      if (existing) {
        existing.push(...hooks as Hook<unknown>[]);
      } else {
        map.set(name as string, hooks as Hook<unknown>[]);
      }

      return collection;
    },
    unregister: (name, ...hooks) => {
      const existing = map.get(name as string);

      if (existing) {
        for (const hook of hooks) {
          const index = existing.indexOf(hook as Hook<unknown>);

          if (index !== -1) {
            existing.splice(index, 1);
          }
        }
      }

      return collection;
    },
    execute: async (name, ctx) => {
      const hooks = map.get(name as string);

      if (hooks) {
        for (const hook of hooks) {
          const result = await hook(ctx);

          if (result) {
            ctx = result as Hooks[typeof name];
          }
        }
      }

      return ctx;
    },
  };

  return collection;
}
