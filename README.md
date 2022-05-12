

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

### route file

```ts
// file: src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import { getRoutes } from "v-route-generate";
const routes = getRoutes(import.meta.glob("src/views/**/**.vue"), {
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

The result is that the TS file does not use TSX, which is just for convenience.

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

- suffix is View

    e.g. `HelloWorldView.vue`

- homepage is `HomeView.vue`

## Path ID or Param

Not supported now. Use `sessionStorage` to implement, Please.
## Contribution

Welcome to contribute code.

```bash
npm i
```

## License

MIT

Copyright (c) 20022-present, Quanju Wei
