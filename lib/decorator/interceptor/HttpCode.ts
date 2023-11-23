import { Response } from "express";
import _ from "lodash";
import { RxConstant, setName } from "../http/define";
(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");

const HttpCode = (code:number) => {
    return function (value: any, context: ClassMethodDecoratorContext){
        const response = _.get(context.metadata,setName(RxConstant.__response__,context.name)) as Response;
        response.statusCode = code;
    }
}

export{
    HttpCode
}