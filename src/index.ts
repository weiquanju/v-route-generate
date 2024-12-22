import type { GetRoutesOptions, MetaInfo, Path } from "./types";
import { log, setDebugger, toArr, toArrStr, transformPath } from "./utils";

export function getRoutes(meta: MetaInfo, options: GetRoutesOptions) {
  const path = transformPath(meta, options)
  setDebugger(options.debugger)
  if (options.debugger) {

    const routes = toArr(path as Path, meta, 0, options)
    log('Route logs:', JSON.stringify(toArrStr(transformPath(meta, options) as Path, meta, 0, options), null, '\t'))
    log('Actual route used', routes)

    return routes
  };

  return toArr(path as Path, meta, 0, options);
}