import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ArcInterCeptor } from "../../decorator/web/aop";
import { ArcInstance } from "../../decorator/web/application";
import { Goods } from "../entity/goods.entity";

class LogInterCeptor implements ArcInterCeptor{
    handle(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): any {
        const {id,sort_type_id} = req.query;
        if(!id || !sort_type_id){
            return "NEED PARAMS ID OR SORT_TYPE_ID"
        }
        let inst = ArcInstance(Goods)
        inst.id = req.query.id
        inst.sort_type_id = req.query.sort_type_id
    }
}
export {
    LogInterCeptor
}