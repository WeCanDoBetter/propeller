import type { Hook, HookCollection } from "../src/types.js";
import { createHookCollection } from "../src/hooks.js";

// Define context interfaces for testing
interface BeforeExecuteContext {
  a: number;
}

interface AfterExecuteContext {
  b: number;
}

// Define hook functions for testing
const beforeExecuteHook: Hook<BeforeExecuteContext> = async (ctx) => {
  ctx.a = 42; // Modify the context
  return ctx; // Return the modified context
};

const afterExecuteHook: Hook<AfterExecuteContext> = async (ctx) => {
  ctx.b = 99; // Modify the context
  return ctx; // Return the modified context
};

const resetContextHook: Hook<BeforeExecuteContext> = async (ctx) => {
  return undefined; // Return undefined to indicate that the context was not modified
};

describe("Hook System", () => {
  let hooks: HookCollection<{
    beforeExecute: BeforeExecuteContext;
    afterExecute: AfterExecuteContext;
  }>;

  beforeEach(() => {
    hooks = createHookCollection(); // Create a fresh hook collection for each test
  });

  it('should register and execute a "beforeExecute" hook, returning context', async () => {
    // Register the "beforeExecute" hook
    hooks.register("beforeExecute", beforeExecuteHook);

    // Create an initial context
    const context: BeforeExecuteContext = { a: 10 };

    // Execute the "beforeExecute" hook
    const updatedContext = await hooks.execute("beforeExecute", context);

    // Assert that the hook modified and returned the context
    expect(updatedContext.a).toBe(42);
  });

  it('should register and execute an "afterExecute" hook, returning context', async () => {
    // Register the "afterExecute" hook
    hooks.register("afterExecute", afterExecuteHook);

    // Create an initial context
    const context: AfterExecuteContext = { b: 5 };

    // Execute the "afterExecute" hook
    const updatedContext = await hooks.execute("afterExecute", context);

    // Assert that the hook modified and returned the context
    expect(updatedContext.b).toBe(99);
  });

  it("should unregister a hook", async () => {
    // Register the "beforeExecute" hook
    hooks.register("beforeExecute", beforeExecuteHook);

    // Create an initial context
    const context: BeforeExecuteContext = { a: 10 };

    // Execute the "beforeExecute" hook
    const updatedContext = await hooks.execute("beforeExecute", context);

    // Assert that the hook modified and returned the context
    expect(updatedContext.a).toBe(42);

    // Unregister the "beforeExecute" hook
    hooks.unregister("beforeExecute", beforeExecuteHook);

    // Create a new initial context
    const context2: BeforeExecuteContext = { a: 10 };

    // Execute the "beforeExecute" hook again
    const updatedContext2 = await hooks.execute("beforeExecute", context2);

    // Assert that the hook did not modify the context
    expect(updatedContext2.a).toBe(10);
  });

  it("should execute multiple hooks in the specified order, returning context", async () => {
    // Register multiple "beforeExecute" hooks
    hooks.register("beforeExecute", beforeExecuteHook);
    hooks.register("beforeExecute", async (ctx) => {
      ctx.a += 10; // Modify the context
      return ctx; // Return the modified context
    });

    // Create an initial context
    const context: BeforeExecuteContext = { a: 5 };

    // Execute the "beforeExecute" hooks
    const updatedContext = await hooks.execute("beforeExecute", context);

    // Assert that the hooks modified and returned the context in the correct order
    expect(updatedContext.a).toBe(52); // 5 + 42 + 10
  });

  it("should handle hooks returning void, maintaining the previous context", async () => {
    // Register a "resetContext" hook that returns void
    hooks.register("beforeExecute", resetContextHook);

    // Create an initial context
    const context: BeforeExecuteContext = { a: 8 };

    // Execute the "resetContext" hook
    const updatedContext = await hooks.execute("beforeExecute", context);

    // Assert that the context remains unchanged
    expect(updatedContext.a).toBe(8);
  });

  it("should handle non-existent hooks gracefully", async () => {
    // Attempt to execute a non-existent hook
    const context: BeforeExecuteContext = { a: 8 };

    // Execute the non-existent hook
    const updatedContext = await hooks.execute(
      "nonExistentHook" as any,
      context,
    );

    // Assert that the context remains unchanged
    expect(updatedContext.a).toBe(8);
  });
});
