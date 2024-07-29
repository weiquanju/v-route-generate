

# v-route-generate

Automatically generate routing configuration based on file path. Based on Vite, Vue, Vue Router

[中文文档](./README-ZH.md)

<a href="https://www.npmjs.com/package/v-route-generate">
    <img src="https://img.shields.io/badge/npm-1.1.1-brightgreen">
</a>

## Getting Started

Install v-route-generate

```bash
# Choose a package manager you like.

# NPM
npm install v-route-generate --save

# Yarn
yarn add v-route-generate

# pnpm
pnpm install v-route-generate
```

## Usage

### route file

```ts
// file: src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import { getRoutes } from "v-route-generate";
/**
 * @link vite glob-import https://vitejs.dev/guide/features.html#glob-import
 * The `views` path is in `src/`.
 */
const routes = getRoutes(import.meta.glob("../views/**/**.vue"), {
  pathRoot: "../views/",
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

### Dir tree

Tree of the `src/views/` dir:

```text
.
│  AboutView.vue
│  HomeView.vue
│  
└─Hello
    │  HiView.vue
    │  
    └─ChildA
            HomeView.vue
```
### Result Example

This example does not confirm the results, it is convenient to use JSX/TSX for display.

```tsx
[
    {
      path: "/AboutView",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/Hello",
      component: <RouterView />,
      children: [
        {
          path: "HiView",
          component: () => import("../views/Hello/HiView.vue"),
        },
        {
          path: "ChildA",
          component: <RouterView />,
          children: [
            {
              path: "",
              component: () => import("../views/Hello/ChildA/HomeView.vue"),
            },
          ],
        },
      ],
    },
  ]
```

## Naming rules

- PascalStyle (**Recommended**)

- Homepage filename is `HomeView.vue` or `Index.uve`, `index.vue` (**Must**)

- NotFound page is: `404.vue` or `notfound.vue`, `NotFound.vue` (**Must**)

###  Dynamic Route Matching with Params

- **One parameter**

`src/views/User/[userId].vue` (File)  

   → `/User/:userId` (Vue route configure parameter of `path`)
   
   → `/User/123` (Browser access path)

Route Params in Vue SFC

```js
$route.params.pid = '123'
```
- **multi parameter**

`src/views/User/list-[pid]-[userName].vue` (File) 

  → `/User/list-:pid-:userName` (Vue route configure parameter of `path`) 

  → `/User/list-456-Foo` (Browser access path)

Route Params in Vue SFC

```js
$route.params.pid = '123'
$route.params.userName = 'Foo'
```

## Contribution

Welcome to contribute code.

```bash
# install
pnpm install
# or
npm i

# build
pnpm run build
# or
npm run build
```

## License

MIT

Copyright (c) 2022-present, Quanju Wei
