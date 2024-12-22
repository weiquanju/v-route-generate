import type { GetRoutesOptions, MetaInfo, Path, PathOrigin, Route, RouteStr } from "./types";

let isDebugger: boolean | undefined = false;

export const setDebugger = (debug?: boolean) => isDebugger = debug;

export const log = (...args: unknown[]) => isDebugger && console.log('[v-route-generate]', ...args)

/**
 * Regular matching .vue/.tsx/.jsx file suffix
 */
const regExp = /\.(vue|jsx|tsx)$/


export const isVueFile = (name: string) => regExp.test(name);

const getRouteName = (pathRoot: string, path: string) => path
    // remove pathRoot  
    .replace(pathRoot, '')
    // remove suffix
    .replace(regExp, "")
    // remove `[]`
    .replace(/(\[|\])/g, "")
    // eg: /client/order/index to clientOrderIndex
    .replace(/[\/\-](\w|\d)/g, (_, $1) => $1.toUpperCase())
    // first letter uppercase
    .replace(/^\w/, ($0) => $0.toUpperCase())

/**
* Convert the object tree data structure to Vue router array tree structure.
*/
export function toArr(data: Path, meta: MetaInfo, deep: number, options: GetRoutesOptions): Route[] {
    return Object.entries(data).map<Route>(([name, pathInfo]) => {
        if (typeof pathInfo === "string") {
            const routeName = getRouteName(options.pathRoot, pathInfo.toString())
            return { name: routeName, path: parsePathParams(getPath(name, deep)), component: meta[pathInfo] };
        } else {
            return {
                path: parsePathParams(getPath(name, deep)),
                children: toArr(pathInfo, meta, deep + 1, options),
            };
        }
    });
}

/**
* Convert the object tree data structure to Vue router array tree structure.
*/
export function toArrStr(data: Path, meta: MetaInfo, deep: number, options: GetRoutesOptions): RouteStr[] {
    return Object.entries(data).map<RouteStr>(([name, pathInfo]) => {
        if (typeof pathInfo === "string") {
            const routeName = getRouteName(options.pathRoot, pathInfo.toString())
            return { name: routeName, path: parsePathParams(getPath(name, deep)), component: `()=>import('${pathInfo}')` };
        } else {
            return {
                path: parsePathParams(getPath(name, deep)),
                children: toArrStr(pathInfo, meta, deep + 1, options),
            };
        }
    });
}

const IndexPageName = {
    HomeView: '',
    Index: '',
    index: '',
    NotFound: ':pathMatch(.*)*',
    notfound: ':pathMatch(.*)*',
    '404': ':pathMatch(.*)*',
}
const getPath = (name: string, deep: number) => {
    /**
     deep > 0
      ?  name === 'HomeView'// When path is not the first layer, does not need to add a slash.
      ? ""
      : `${name}`
    : name === 'HomeView' //When path is the first layer, need to add a slash. 
      ? "/"
      : `/${name}`;
     */
    return `${deep > 0 ? '' : '/'}${IndexPageName[name as keyof typeof IndexPageName] !== undefined ? IndexPageName[name as keyof typeof IndexPageName] : name}`
}

/**
 * Parse Parameters of Dynamic Route
 * @param path 
 * @returns 
 */
const parsePathParams = (path: string) => path.replace(/\[([^\]]+)\]+/g, (m, m0) => `:${m0}`)


export const transformPath = (meta: MetaInfo, options: GetRoutesOptions) => {
    /**
     * Regular matching `src` + `pathRoot` path part
     * Example:
     *   new RegExp(`../views/`)
     *   The '../views/' part of '../views/HomeView.vue' will be removed
     */
    const regRoot = new RegExp(options.pathRoot);
    /**
     * Here is to regenerate the tree structure data from the flat path information
     * ['a/b','a/c/d'] => {a:{b:'b',c:{d：'d'}}}
     */
    return Object.keys(meta).reduce((all, currentPath) => {
        //Clean up the path eg: path '../views/HomeView.vue' will be processed as 'HomeView.vue'
        const paths = currentPath.replace(regRoot, "").split("/");

        let tmp = all;
        while (paths.length) {
            // Path name, file name
            const name: string = paths.shift() || "";

            if (!isVueFile(name)) {// Path name
                if (!tmp[name]) tmp[name] = {};
                tmp = tmp[name] as PathOrigin;
            } else {// A Vue file name
                const file = name.replace(/\.(vue|[tj]sx?)/, ""); // If the Vue file name `HomeView.vue` is changed to key, it is `HomeView`
                tmp[file] = currentPath;
            }
        }
        return all;
    }, {} as PathOrigin);
}