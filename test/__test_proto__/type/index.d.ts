import { T_WStream, T_RStream } from "../stream";

type Constructor<T> = new (...args:any[])=>T

type JceStruct = {
    Write:Constructor<T_WStream>,
    Read:Constructor<T_RStream>,
    _t_className:string;
}

type T_BASE = {
    _t_className : string;
}

type module = string;
type invokeMethod = string;
type invokeRequest = string;
type invokeResponse =  string;
type plain = Record<string,any>
type InvokeContext = {
    byteLength: string;
    moduleName: string;
    invokeMethod:string;
    invokeRequest: string;
    traceId: any;
    sendResponse ?:Function;
    responseUid?:string;
    invokeResponse?:string;
}
export {
    Constructor,
    JceStruct,
    T_BASE,
    module,
    invokeMethod,
    invokeRequest,
    invokeResponse,
    plain,
    InvokeContext
}