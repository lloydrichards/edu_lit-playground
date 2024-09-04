# How to: Setup Lit with Tailwind

## 1. Create a vite project

To create a vite project, run the following command:

```bash
bun create vite@latest
```

Make sure to select the `lit` framework when prompted, and use TypeScript.

Once setup, navigate to the project directory and install the required
dependencies:

```bash
cd my-vite-project
bun install
```

## 2. Structure the project

currently, the project structure should have a `public` and `src` directory.
Vite provides you with and example my-element.ts file in the `src` directory and
an `index.html` file in the root directory.

First move the index.html file to the `src` directory.

```diff
 .
 ├── 📁 public
 ├── 📂 src
 │   ├── 📁 assets
 │   ├── index.css
+│   ├── index.html
 │   ├── my-element.ts
 │   └── vite-env.d.ts
 ├── .gitignore
-├── index.html
 ├── package.json
 └── tsconfig.json
```

Now create a `lib` directory and move the `assets`. Now create a components
folder inside lib and move the `my-element.ts` file to the `lib` directory.
Finally create a main.ts file in the `lib` directory and export the
`my-element.ts` file.

```diff
 .
+├── 📂 lib
+│   ├── 📁 assets
+│   ├── 📂 components
+│   │   └── my-element.ts
+│   └── main.ts
 ├── 📁 public
 ├── 📂 src
-│   ├── 📁 assets
 │   ├── index.css
 │   ├── index.html
-│   ├── my-element.ts
 │   └── vite-env.d.ts
 ├── .gitignore
 ├── package.json
 └── tsconfig.json
```

And modify the `index.html` file to point to the `lib/my-element.ts` file.

```diff
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Lit + TS</title>
     <link rel="stylesheet" href="/src/index.css" />
+    <script type="module" src="/lib/main.ts"></script>
  </head>
```

## 3. Create a vite.config.ts file

First lets install the required dependencies:

```bash
bun add -D vite-plugin-dts vite-tsconfig-paths
```

At the root of the project, create a `vite.config.ts` file and add the
following:

```typescript
import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), dts({ rollupTypes: true })],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      name: "MyElement",
      fileName: "my-element",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          preserveModules: true,
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime",
        },
      },
    },
  },
  server: {
    open: "/src/index.html",
  },
});
```

You can now test building the project by running the following command:

```bash
bun run build
```

And you should see the output in the `dist` directory. (make sure to add the
dist directory to the `.gitignore` file)

```diff
 .
+├── 📂 dist
+│   ├── my-element.d.ts
+│   ├── my-element.js
+│   └── my-element.umd.cjs
 ├── 📁 lib
 ├── 📁 public
 ├── 📁 src
 ├── .gitignore
 ├── package.json
 └── tsconfig.json
```

Finally, update the `package.json` file to point to the `dist/` files.

```diff
{
  "name": "my-lit-element",
- "private": true,
+ "version": "0.0.1",
  "type": "module",
+  "files": [
+   "dist"
+ ],
+ "main": "./dist/my-element.umd.cjs",
+ "module": "./dist/my-element.js",
+ "exports": {
+   ".": {
+     "import": "./dist/my-element.js",
+     "require": "./dist/my-element.umd.cjs"
+   }
+ },
  "scripts": {
    "dev": "vite ",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lit": "^3.2.0"
  },
  "devDependencies": {
    "typescript": "^5.5.3",
    "vite": "^5.4.1",
    "vite-plugin-dts": "^4.1.0",
    "vite-tsconfig-paths": "^5.0.1"
  }
}
```
