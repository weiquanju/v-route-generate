import { h } from "vue";
import { RouterView } from "vue-router";
import type {MetaInfo,Path,Route} from './index.d'

const isVueFile = (name: string) => /\.vue/.test(name);

export function getRoutes(meta: MetaInfo, options: { pathRoot: string }) {
  /**
   * 正则匹配src+pathRoot路径部分
   * 例如：
   *   new RegExp(`[./]*views/`)
   *   将去掉 '../views/HomeView.vue'  中 '../views/' 这一部分
   */
  const reg = new RegExp(`[./]*${options.pathRoot}`);

  /**
   * 此处是将扁平的路径信息，重新生成树型结构数据
   * ['a/b','a/c/d'] => {a:{b:'b',c:{d：'d'}}}
   */
  const path = Object.keys(meta).reduce((all, c) => {
    //清理路径 例如：'../views/HomeView.vue'将处理为'HomeView.vue'
    const paths = c.replace(reg, "").split("/");

    let tmp = all;
    while (paths.length) {
      // 路径名、文件名
      const name: string = paths.shift() || "";
      // 不是vue文件名，就是路径
      if (!isVueFile(name)) {
        if (!tmp[name]) tmp[name] = {};
        tmp = tmp[name] as Path;
      } else {
        const file = name.replace(".vue", ""); // HomeView.vue 文件名转为key则为 HomeView
        tmp[file] = c;
      }
    }
    return all;
  }, {} as Path);
  console.log(path);

  return toArr(path, meta, 0);
}

const getPath = (name: string, deep: number) =>
  deep > 0
    ? /* 如果 不是 第一层，不需要 加斜杠*/ name === "HomeView"
      ? ""
      : `${name}`
    : /* 如果 是   第一层，需要  加斜杠*/ name === "HomeView"
    ? "/"
    : `/${name}`;
/**
 * 嵌套路由示例
 * [
    {
      path: "/AboutView", // 第一级 需要 以斜杠/开始
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
          path: "HiView", // 第二级及一下 不需要 以斜杠/开始
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
 */

function toArr(data: Path, meta: MetaInfo, deep: number): Route[] {
  return Object.entries(data).map<Route>(([name, pathInfo]) => {
    if (typeof pathInfo === "string") {
      return { path: getPath(name, deep), component: meta[pathInfo] };
    } else {
      return {
        path: getPath(name, deep),
        component: pathInfo.HomeView ? meta[pathInfo.HomeView] : h(RouterView),
        children: toArr(pathInfo, meta, deep + 1),
      };
    }
  });
}
