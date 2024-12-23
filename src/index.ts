import type { GetRoutesOptions, MetaInfo, Path } from "./types";
import { log, setDebugger, toArr, toArrStr, transformPath } from "./utils";

export function getRoutes(meta: ReturnType<ImportMeta['glob']>, options: GetRoutesOptions) {
  const path = transformPath(meta as MetaInfo, options)
  setDebugger(options.debugger)
  if (options.debugger) {

    const routes = toArr(path as Path, meta as MetaInfo, 0, options)
    log('Route logs:', JSON.stringify(toArrStr(transformPath(meta as MetaInfo, options) as Path, meta as MetaInfo, 0, options), null, '\t'))
    log('Actual route used', routes)

    return routes
  };

  return toArr(path as Path, meta as MetaInfo, 0, options);
}