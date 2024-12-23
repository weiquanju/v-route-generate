export type Loader = () => Promise<{
    [key: string]: any;
}>;

export type MetaInfo = Record<string, Loader> & { name?: string; };

export interface Path {
    [key: string]: keyof MetaInfo | Record<string, keyof MetaInfo>
};

export interface PathOrigin {
    [key: string]: PathOrigin | string;
};

export interface RouteBase<T> {
    path: string;
    component?: T;
    children?: RouteBase<T>[];
}

export type RouteStr = RouteBase<string>

export interface GetRoutesOptions {

    debugger?: boolean;
    /**
     * The path where the views are located
     */
    pathRoot: string;
}