import { Response } from "express";

const Redirect = (url:string,code:number) => {
    return function (value: any, context: ClassMethodDecoratorContext){
        async function limit_interceptor_fn<This = unknown>(
            this: This,
            ...args: any[]
        ) {
            const [_,Response] = args as unknown as [any,Response];
            Response.statusCode  = code
            Response.redirect(url);
            let data = await value.call(this, ...args);
            return data;
        }
        return limit_interceptor_fn
    }
}

export{
    Redirect
}