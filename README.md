

# v-route-generate

A tool to generate routes for Vue-Router with Vite.

<a href="https://www.npmjs.com/package/v-route-generate">
    <img src="https://img.shields.io/badge/npm-1.0.2-brightgreen">
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

The result is that the TS file does not use TSX, which is just for the convenience of display.

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

- pascal style

- Suffix is `View`

    e.g. `HelloWorldView.vue`

- Homepage is `HomeView.vue` or `Index.uve`, `index.vue`
- 
- NotFound page is: `404.vue` or `notfound.vue`, `NotFound.vue`

###  Dynamic Route Matching with Params

- One parameter

  `src/views/User/[userId].vue` (file)  

   → `/User/:userId` (vue route config path)  
   
   → `/User/123`


```js
$route.params.pid = '123'
```
- multi parameter

  `src/views/User/list-[pid]-[userName].vue` (file) 

  → `/User/list-:pid-:userName` (vue route config path) 

  → `/User/list-456-Foo`

```js
$route.params.pid = '123'
$route.params.userName = 'Foo'
```

## Contribution

Welcome to contribute code.

```bash
# pnpm
pnpm i

# npm
npm i
```

## License

MIT

Copyright (c) 2022-present, Quanju Wei
