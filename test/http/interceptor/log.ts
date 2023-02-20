import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Goods } from "../entity/goods.entity";
import { ArcInterCeptor } from "../../../decorator/web/aop";
import { class_transformer } from "../../../decorator/web/pipe";

class LogInterCeptor implements ArcInterCeptor{
    handle(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): any {
        const {id,SortTypeId} = req.query;
        if(!id || !SortTypeId){
            return "NEED PARAMS ID OR SORT_TYPE_ID"
        }
        req.query = class_transformer.plainToClass(req.query,Goods) as any;
    }
}
export {
    LogInterCeptor
}