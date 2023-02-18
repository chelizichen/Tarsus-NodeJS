import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ArcInterCeptor } from "../../decorator/web/aop";

class LogInterCeptor implements ArcInterCeptor{
    next(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): any {
        console.log('NEXT 执行');
        if(!req.query.id){
            return "NEED PARAMS ID"
        }
    }
}
export {
    LogInterCeptor
}