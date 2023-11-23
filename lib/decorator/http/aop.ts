import { Request,Response } from "express";
import _ from "lodash";
import { RxConstant, setName } from "./define";
(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");

function UseInterceptor(interceptor:TarsusInterceptor){
    return function (value:any,context:ClassMethodDecoratorContext){
        return function (value:any,context:ClassMethodDecoratorContext){
            _.set(context.metadata,setName(RxConstant.__rx__interceptor__,context.name),interceptor)
        }
    }
}

interface TarsusInterceptor{
    handle(req:Request):any;
}

export {
    UseInterceptor,
    TarsusInterceptor
}