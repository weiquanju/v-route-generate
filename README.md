# v-route-generate

Automate the tedious task of creating Vue Router configurations. Simply define your page components, and let this plugin handle the rest.


<details>
<summary>Dependent</summary><br>

- Vite@2.9.0

- Vue@3.0.0

- Vue-Router@4.0.0

<br></details>

### Features

- 🚀 Automatically generate Vue Router configurations based on the directory structure of your page components.

- 🦾 Automatically generate the `name` of the route based on the file name. This helps with better support for `keep-alive`.

- 📥 Support `Vue` and `Vue TSX/JSX` file formats.

- 💡 Support dynamic route matching with params.


[中文文档](https://github.com/weiquanju/v-route-generate/blob/main/README-ZH.md)

<a href="https://www.npmjs.com/package/v-route-generate">
    <img src="https://img.shields.io/badge/npm-1.2.0-brightgreen">
</a>

### Getting Started

Install v-route-generate

```bash
# Choose a package manager you like.
npm install v-route-generate --save
# or
yarn add v-route-generate
# or
pnpm install v-route-generate
```

### Usage

##### Dir tree

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

##### Generate route

```ts
// file: src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import { getRoutes } from "v-route-generate";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: getRoutes(import.meta.glob("../views/**/**.vue"), {
    /** 
     * Required. The root path of the directory tree, using relative paths, ending with '/'
     */
    pathRoot: "../views/",
    debugger: true,// To print the route.
  }),
});

export default router;
```


<details>
<summary>Result</summary><br>

```ts
// Based on the routing configuration generated from the directory above:
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

##### Naming rules

- Homepage filename is `HomeView.vue` or `Index.uve`, `index.vue` (**Must**)

- NotFound page is `404.vue` or `notfound.vue`, `NotFound.vue` (**Must**)

##### Dynamic Route Matching with Params

- **Parameter**

`src/views/User/list-[pid]-[userName].vue` (File)

→ `/User/list-:pid-:userName` (Vue route configure parameter of `path`)

→ `/User/list-456-Foo` (Browser access path)

Route Params in Vue SFC
```vue
<template>
{{$route.params.pid}}
<!-- print 123 -->
{{$route.params.userName}}
<!-- print Foo -->
</template>
```

### Contribution

Welcome to contribute code.

```bash
pnpm install
pnpm run build
# or
npm i
npm run build
```

### License

MIT

Copyright (c) 2022-present, weiquanju
