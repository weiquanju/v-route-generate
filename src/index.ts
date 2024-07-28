import { h, type VNode } from "vue";
import { RouterView } from "vue-router";


export type Loader = () => Promise<{
  [key: string]: any;
}>;

export type MetaInfo = Record<string, Loader>;

export type Path = Record<string, keyof MetaInfo | Record<string, keyof MetaInfo>>;

export interface Route {
  path: string;
  component: Loader | VNode;
  children?: Route[];
}


const isVueFile = (name: string) => /\.vue/.test(name);

export function getRoutes(meta: MetaInfo, options: { pathRoot: string }) {
  /**
   * Regular matching `src` + `pathRoot` path part
   * Example:
   *   new RegExp(`../views/`)
   *   The '../views/' part of '../views/HomeView.vue' will be removed
   */
  const reg = new RegExp(options.pathRoot);

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

const IndexPageName = {
  HomeView: '',
  Index: '',
  index: '',
  NotFound: ':pathMatch(.*)*',
  notfound: ':pathMatch(.*)*',
  '404': ':pathMatch(.*)*',
}

type DefaultPageKey = keyof typeof IndexPageName

const getPath = (name: string, deep: number) =>
  `${deep > 0 ? '' : '/'}${IndexPageName[name as DefaultPageKey] !== undefined ? IndexPageName[name as DefaultPageKey] : name}`
/**
 deep > 0
  ?  name === 'HomeView'// When path is not the first layer, does not need to add a slash.
  ? ""
  : `${name}`
: name === 'HomeView' //When path is the first layer, need to add a slash. 
  ? "/"
  : `/${name}`;
 */

/**
 * Parse Parameters of Dynamic Route
 * @param path 
 * @returns 
 */
const parsePathParams = (path: string) => path.replace(/\[([^\]]+)\]+/g, (m, m0) => `:${m0}`)
// Convert the object tree data structure to Vue router array tree structure.
function toArr(data: Path, meta: MetaInfo, deep: number): Route[] {
  return Object.entries(data).map<Route>(([name, pathInfo]) => {
    if (typeof pathInfo === "string") {
      return { path: parsePathParams(getPath(name, deep)), component: meta[pathInfo] };
    } else {
      return {
        path: parsePathParams(getPath(name, deep)),
        component: pathInfo.HomeView ? meta[pathInfo.HomeView] /*If there is a `HomeView.vue` page under the directory*/ : h(RouterView),
        children: toArr(pathInfo, meta, deep + 1),
      };
    }
  });
}
