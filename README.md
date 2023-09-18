# @wecandobetter/propeller

![npm](https://img.shields.io/npm/v/@wecandobetter/propeller)
![GitHub](https://img.shields.io/github/license/wecandobetter/propeller)

A flexible and extensible hook system for JavaScript/TypeScript applications.
Empower your projects with the ability to register, execute, and manage hooks
for customized behavior and context management.

## Features 🎣

- 🔗 Register hooks with unique names for different purposes.
- 🔄 Execute hooks in a specified order, allowing customization of behavior.
- 🔄 Hooks can modify context and return updated context, providing versatility.
- 📜 Type-safe hooks and context management for robust applications.
- 🌐 Extensible and reusable for various projects and use cases.

## Installation 📦

Install the package via npm:

```bash
npm install @wecandobetter/propeller
```

## Usage 📘

```typescript
import {
  createHookCollection,
  type Hook,
  type HookCollection,
} from "@wecandobetter/propeller";

// Define context interfaces for testing
interface BeforeExecuteContext {
  a: number;
}

interface AfterExecuteContext {
  b: number;
}

// Create a hook collection
const hooks = createHookCollection<{
  beforeExecute: BeforeExecuteContext;
  afterExecute: AfterExecuteContext;
}>();

// Register a hook
hooks.register("beforeExecute", async (ctx) => {
  ctx.a = 42; // Modify the context
});

// Execute a hook
const context: BeforeExecuteContext = { a: 10 };
const updatedContext = await hooks.execute("beforeExecute", context);

// Output: The context is updated with a = 42
console.log(updatedContext);
```

## License 📜

This project is licensed under the [MIT License](LICENSE).

## Contributing 🙋‍♂️

Contributions are welcome! Feel free to open issues and submit pull requests.

## Credits 👏

Made with ❤️‍🔥 by [We Can Do Better](https://wcdb.life).
