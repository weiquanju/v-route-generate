

# v-route-generate

<a href="https://www.npmjs.com/package/v-route-generate">
    <img src="https://img.shields.io/badge/npm-1.0.0-brightgreen">
</a>

## Getting Started

install v-route-generate

```sh
# Choose a package manager you like.

# NPM
$ npm install v-route-generate --save

# Yarn
$ yarn add v-route-generate

# pnpm
$ pnpm install v-route-generate
```

## Usage


```ts
// file: src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import { getRoutes } from "v-route-generate";
const routes = getRoutes(import.meta.glob("@/views/**/**.vue"), {
  pathRoot: "views/",
});
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
router.beforeResolve(async (to) => {
  console.log(to);
});

console.log(routes);

export default router;

```

## Contribution

Welcome to contribute code.

```bash
npm i
```

## License

MIT

Copyright (c) 20022-present, Quanju Wei
