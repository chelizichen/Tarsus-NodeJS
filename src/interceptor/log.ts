import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ArcInterCeptor } from "../../decorator/web/aop";

class LogInterCeptor implements ArcInterCeptor{
    hijack(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): any {
        if(!req.query.id){
            return "NEED PARAMS ID"
        }
    }
}
export {
    LogInterCeptor
}