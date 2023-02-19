import { Request } from "express";

type query<T = any> = Request<any, any, any, T, any>;

type body<T = any> = Request<any, any, T, any, any>;

export {
    query,body
}