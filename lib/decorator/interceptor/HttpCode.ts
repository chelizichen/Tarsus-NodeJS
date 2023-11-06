import { Response } from "express";

const HttpCode = (code:number) => {
    return function (value: any, context: ClassMethodDecoratorContext){
        async function limit_interceptor_fn<This = unknown>(
            this: This,
            ...args: any[]
        ) {
            const [_,Response] = args as unknown as [any,Response];
            let data = value.call(this, ...args);
            Response.statusCode = code;
            return data;
        }
        return limit_interceptor_fn
    }
}

export{
    HttpCode
}