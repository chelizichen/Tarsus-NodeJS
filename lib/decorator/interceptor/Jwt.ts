import { Request } from "express";
import _ from "lodash";
import { RxConstant, setName } from "../http/define";
import { TarsusJwtValidate } from "../http/interfaces";
(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");

// import { ParamsDictionary } from "express-serve-static-core";
// import { ParsedQs } from "qs";
// import { TokenError } from "../http/error";


// 验证函数

// class Demojwt implements TarsusJwtValidate{
//     async handle(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<void> {
//         const token = req.headers.authorization?.replace('Bearer ', '');
//         if (!token) {
//             throw TokenError('jwt 验证失败')
//         }
//     }
// }

const JwtValidate = (jwtvalidate:TarsusJwtValidate)=>{
    return function(value,context:ClassDecoratorContext | ClassMethodDecoratorContext){
        if(context.kind == "class"){
            _.set(context.metadata,RxConstant.__rx__controller__jwt__,jwtvalidate)
            console.log(context.metadata);
            console.log('已设置class Jwt');
        }
        if(context.kind == "method"){
            _.set(context.metadata,setName(RxConstant.__rx__method__jwt__,context.name),jwtvalidate)
            console.log('已设置method Jwt',context.name);
        }
    }
}

export {
    JwtValidate
}