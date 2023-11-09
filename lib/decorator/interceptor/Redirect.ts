import { Response } from "express";
import _ from "lodash";

const Redirect = (url:string,code:number) => {
    return function (value: any, context: ClassMethodDecoratorContext){
        async function limit_interceptor_fn<This = unknown>(
            this: This,
            ...args: any[]
        ) {
            const response = _.get(context.metadata,'__response__') as Response;
            response.statusCode  = code
            response.redirect(url);
            value.call(this, ...args);
        }
        return limit_interceptor_fn
    }
}

export{
    Redirect
}