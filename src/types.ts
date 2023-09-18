/**
 * A hook. Hooks are executed in the order they are registered. The function returns
 * the updated context, which may have been modified or rerefenced by the hooks.
 * @template Context The type of the context.
 * @param ctx The context to pass to the hooks.
 * @returns The updated context, or undefined if the context was not rerefenced.
 */
export type Hook<Context> = (ctx: Context) => Promise<void | Context>;

/**
 * A hook map. Hooks are executed in the order they are registered. The function returns
 * the updated context, which may have been modified or rerefenced by the hooks.
 * @template Context The type of the context.
 */
export type HookMap<Context> = Map<string, Hook<Context>[]>;

/**
 * A hook collection. Hooks are executed in the order they are registered. The function returns
 * the updated context, which may have been modified or rerefenced by the hooks.
 * @template Hooks The type of the hooks.
 */
export interface HookCollection<Hooks extends Record<string, unknown>> {
  /**
   * Register a hook. Hooks are executed in the order they are registered.
   * @param name The name of the hook
   * @param hooks The hooks to register
   */
  register: <K extends keyof Hooks>(
    name: K,
    ...hooks: Hook<Hooks[K]>[]
  ) => HookCollection<Hooks>;

  /**
   * Execute a hook. Hooks are executed in the order they are registered. The function returns
   * the updated context, which may have been modified or rerefenced by the hooks.
   * @param name The name of the hook.
   * @param ctx The context to pass to the hooks.
   * @returns The updated context.
   */
  execute: <K extends keyof Hooks>(name: K, ctx: Hooks[K]) => Promise<Hooks[K]>;
}
