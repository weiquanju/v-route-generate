export type Loader = () => Promise<{
  [key: string]: any;
}>;

export type MetaInfo = Record<string, Loader>;

export type PathType = Record<string, keyof MetaInfo>;
export type Path = Record<string, keyof MetaInfo | PathType>;

export interface Route {
  path: string;
  component: JSX.Element | Loader;
  children?: Route[];
}

export function getRoutes(meta: MetaInfo, options: { pathRoot: string }):Route[]



declare module 'v-route-generate'