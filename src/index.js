"use strict";
exports.__esModule = true;
exports.getRoutes = void 0;
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var isVueFile = function (name) { return /\.vue/.test(name); };
function getRoutes(meta, options) {
    /**
     * 正则匹配src+pathRoot路径部分
     * 例如：
     *   new RegExp(`[./]*views/`)
     *   将去掉 '../views/HomeView.vue'  中 '../views/' 这一部分
     */
    var reg = new RegExp("[./]*".concat(options.pathRoot));
    /**
     * 此处是将扁平的路径信息，重新生成树型结构数据
     * ['a/b','a/c/d'] => {a:{b:'b',c:{d：'d'}}}
     */
    var path = Object.keys(meta).reduce(function (all, c) {
        //清理路径 例如：'../views/HomeView.vue'将处理为'HomeView.vue'
        var paths = c.replace(reg, "").split("/");
        var tmp = all;
        while (paths.length) {
            // 路径名、文件名
            var name_1 = paths.shift() || "";
            // 不是vue文件名，就是路径
            if (!isVueFile(name_1)) {
                if (!tmp[name_1])
                    tmp[name_1] = {};
                tmp = tmp[name_1];
            }
            else {
                var file = name_1.replace(".vue", ""); // HomeView.vue 文件名转为key则为 HomeView
                tmp[file] = c;
            }
        }
        return all;
    }, {});
    console.log(path);
    return toArr(path, meta, 0);
}
exports.getRoutes = getRoutes;
var getPath = function (name, deep) {
    return deep > 0
        ? /* 如果 不是 第一层，不需要 加斜杠*/ name === "HomeView"
            ? ""
            : "".concat(name)
        : /* 如果 是   第一层，需要  加斜杠*/ name === "HomeView"
            ? "/"
            : "/".concat(name);
};
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
function toArr(data, meta, deep) {
    return Object.entries(data).map(function (_a) {
        var name = _a[0], pathInfo = _a[1];
        if (typeof pathInfo === "string") {
            return { path: getPath(name, deep), component: meta[pathInfo] };
        }
        else {
            return {
                path: getPath(name, deep),
                component: pathInfo.HomeView ? meta[pathInfo.HomeView] : (0, vue_1.h)(vue_router_1.RouterView),
                children: toArr(pathInfo, meta, deep + 1)
            };
        }
    });
}
