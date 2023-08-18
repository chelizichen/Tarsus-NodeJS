import { Request,Response } from "express";

function UseInterceptor(interceptor:TarsusInterceptor){
    return function (value:any,context:ClassMethodDecoratorContext){
        async function interceptor_func<This = unknown>(this: This, ...args: any[]) {
            const data = await interceptor.handle.call(this, ...args)
            if (data) {
                return data
            } else {
                let data = value.call(this, ...args)
                return data
            }
        };
        return interceptor_func;
    }
}

interface TarsusInterceptor{
    handle(req:Request):any;
}

export {
    UseInterceptor,TarsusInterceptor
}