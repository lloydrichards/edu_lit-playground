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
 ├── public
 │   └── favicon.ico
 ├── src
 │   ├── assets
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
 ├── public
 │   └── favicon.ico
+├── lib
+│   ├── assets
+│   ├── components
+│   │   └── my-element.ts
+│   └── main.ts
 ├── src
-│   ├── assets
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


