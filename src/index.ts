import { h } from "vue";
import { RouterView } from "vue-router";
import type {MetaInfo,Path,Route} from './index.d'

const isVueFile = (name: string) => /\.vue/.test(name);

export function getRoutes(meta: MetaInfo, options: { pathRoot: string }) {
  /**
   * Regular matching `src` + `pathroot` path part
   * Example:
   *   new RegExp(`[./]*views/`)
   *   The '../views/' part of '../views/HomeView.vue' will be removed
   */
  const reg = new RegExp(`[./]*${options.pathRoot}`);

  /**
   * Here is to regenerate the tree structure data from the flat path information
   * ['a/b','a/c/d'] => {a:{b:'b',c:{d：'d'}}}
   */
  const path = Object.keys(meta).reduce((all, c) => {
    //清理路径 例如：'../views/HomeView.vue'将处理为'HomeView.vue'
    const paths = c.replace(reg, "").split("/");

    let tmp = all;
    while (paths.length) {
      // Path name, file name
      const name: string = paths.shift() || "";
      
      if (!isVueFile(name)) {// Path name
        if (!tmp[name]) tmp[name] = {};
        tmp = tmp[name] as Path;
      } else {// A Vue file name
        const file = name.replace(".vue", ""); // If the Vue file name `HomeView.vue` is changed to key, it is `HomeView`
        tmp[file] = c;
      }
    }
    return all;
  }, {} as Path);
  // console.log(path);

  return toArr(path, meta, 0);
}

const getPath = (name: string, deep: number) =>
  deep > 0
    ? /* If it's not the first layer, you don't need to add a slash. */ name === "HomeView"
      ? ""
      : `${name}`
    : /* If it is the first layer, you need to add a slash. */ name === "HomeView"
    ? "/"
    : `/${name}`;

// Convert the object tree data structure to Vue router array tree structure.
function toArr(data: Path, meta: MetaInfo, deep: number): Route[] {
  return Object.entries(data).map<Route>(([name, pathInfo]) => {
    if (typeof pathInfo === "string") {
      return { path: getPath(name, deep), component: meta[pathInfo] };
    } else {
      return {
        path: getPath(name, deep),
        component: pathInfo.HomeView ? meta[pathInfo.HomeView] /*If there is a `HomeView.vue` page under the directory*/ : h(RouterView),
        children: toArr(pathInfo, meta, deep + 1),
      };
    }
  });
}
