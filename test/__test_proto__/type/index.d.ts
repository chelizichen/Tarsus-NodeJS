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
export {
    Constructor,
    JceStruct,
    T_BASE
}