import { Response } from "express";
import _ from "lodash";
import { RxConstant, setName } from "../http/define";

const HttpCode = (code:number) => {
    return function (value: any, context: ClassMethodDecoratorContext){
        async function limit_interceptor_fn<This = unknown>(
            this: This,
            ...args: any[]
        ) {
            const response = _.get(context.metadata,setName(RxConstant.__response__,context.name)) as Response;
            let data = await value.call(this, ...args);
            response.statusCode = code;
            return data;
        }
        return limit_interceptor_fn
    }
}

export{
    HttpCode
}