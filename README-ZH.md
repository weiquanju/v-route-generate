# v-route-generate

根据页面文件目录树，自动生成路由配置。

<details>
<summary>依赖环境</summary><br>

- Vite@2.9.0

- Vue@3.0.0

- Vue-Router@4.0.0

<br></details>

### 特性

- 🚀 根据页面文件目录树，自动生成路由配置。

- 🦾 根据文件名称，自动生成路由的 `name`，配合defineOptions更好的支持keep-alive。

- 📥 支持 `Vue` 和 `Vue TSX/JSX` 文件格式。

- 💡 支持路由路径动态参数。

[English](./README.md)

<a href="https://www.npmjs.com/package/v-route-generate">
    <img src="https://img.shields.io/badge/npm-1.2.0-brightgreen">
</a>

### 开始

安装 `v-route-generate`

```bash
# 选择一个你喜欢的包管理工具
npm install v-route-generate --save
# or
yarn add v-route-generate
# or
pnpm install v-route-generate
```

## 用法

### 目录树

页面视图Vue SFC文件目录为： `src/views/`, 其目录结构示例：

```text
│  index.vue
│
└─foo
    ├─  app.tsx
    ├─  app.vue.html
    └─  index.vue
```

### 配置生成路由

```ts
// file: src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import { getRoutes } from "v-route-generate";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: getRoutes(import.meta.glob("../views/**/**.vue"), {
    pathRoot: "../views/", //必填。目录树的根路径，使用相对路径，`/`结尾
    debugger: true,//用于测试，打印路由
  }),
});

export default router;
```

<details>
<summary>生成结果</summary><br>

```ts
// 根据上面目录生成的路由配置如下：
[
	{
		"path": "/foo",
		"children": [
			{
				"name": "FooApp",
				"path": "app",
				"component": ()=>import('../views/foo/app.tsx')
			},
			{
				"name": "FooIndex",
				"path": "",
				"component": ()=>import('../views/foo/index.vue')
			}
		]
	},
	{
		"name": "Index",
		"path": "/",
		"component": ()=>import('../views/index.vue')
	}
]
```

<br></details>

## 命名规则

- 主页名称（**强制**）：`HomeView` or `Index.uve`, `index`，任选其一则可。

- 404 页面名称（**强制**）: `404` or `notfound`, `NotFound`，任选其一则可。

### 支持文件格式

- `.vue`

- `.tsx`

- `.jsx`

### 路由路径动态参数

- **参数示例**

`src/views/User/list-[pid]-[userName].vue` (项目中的文件)

→ `/User/list-:pid-:userName` (实际生成的 vue route `path`参数)

→ `/User/list-456-Foo` (浏览器中访问路径)

Vue 页面中参数值示例：

```vue
<template>
{{$route.params.pid}}
<!-- print 123 -->
{{$route.params.userName}}
<!-- print Foo -->
</template>
```

## 贡献

欢迎Issue，贡献代码更加nice。

```bash
pnpm install
pnpm run build
# or
npm i
npm run build
```

## License

MIT

Copyright (c) 2022-present, weiquanju
