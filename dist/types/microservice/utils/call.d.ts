/// <reference types="node" />
export declare function call(pkg: any): Buffer;
export declare function getRequestHead(...args: string[]): string;
export declare function getRequestArgs<K extends string | Record<string, any> | Array<any>>(args: K): string;
