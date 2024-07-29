# v-route-generate

基于Vite,Vue,Vue-Router，根据文件路径，自动生成路由配置。

[English](./README.md)

<a href="https://www.npmjs.com/package/v-route-generate">
    <img src="https://img.shields.io/badge/npm-1.1.1-brightgreen">
</a>

## 开始

安装 `v-route-generate`

```bash
# 选择一个你喜欢的包管理工具

# NPM
npm install v-route-generate --save

# Yarn
yarn add v-route-generate

# pnpm
pnpm install v-route-generate
```

## 用法

### 路由配置

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

### 页面视图vue sfc文件目录树

页面视图vue sfc文件目录为： `src/views/`

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

### 生成结果示例

本示例并非证实结果，方便展示使用JSX/TSX进行展示。

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
];
```

## 命名规则

- 建议（**非强制**）PascalStyle命名风格，即大驼峰命名。

- 主页名称（**强制**）：`HomeView.vue` or `Index.uve`, `index.vue`，任选其一则可。

- 404页面名称（**强制**）: `404.vue` or `notfound.vue`, `NotFound.vue`，任选其一则可。

### 参数的动态路径匹配

- **单一参数示例**

`src/views/User/[userId].vue` (项目中的文件)

→ `/User/:userId` (实际生成的vue route `path`参数)

→ `/User/123` (浏览器中访问路径)

Vue页面中参数值示例：

```js
$route.params.pid = "123";
```

- **多个参数示例**

`src/views/User/list-[pid]-[userName].vue` (项目中的文件)

→ `/User/list-:pid-:userName` (实际生成的vue route `path`参数)

→ `/User/list-456-Foo` (浏览器中访问路径)

Vue页面中参数值示例：

```js
$route.params.pid = "123";
$route.params.userName = "Foo";
```

## 贡献

欢迎贡献代码。

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
