import { Request,Response } from "express";
import _ from "lodash";
(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");

function UseInterceptor(interceptor:TarsusInterceptor){
    return function (value:any,context:ClassMethodDecoratorContext){
        return function (value:any,context:ClassMethodDecoratorContext){
            _.set(context.metadata,"__rx__interceptor__",interceptor)
        }
    }
}

interface TarsusInterceptor{
    handle(req:Request):any;
}

export {
    UseInterceptor,TarsusInterceptor
}