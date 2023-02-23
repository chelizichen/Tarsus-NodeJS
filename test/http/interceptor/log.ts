import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Goods } from "../entity/goods.entity";
import { TarsusInterCeptor } from "../../../decorator/web/aop/index";
import { class_transformer } from "../../../decorator/web/pipe/index";

class LogInterCeptor implements TarsusInterCeptor {
  handle(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>
  ): any {
    const { id, SortTypeId } = req.query;
    if (!id || !SortTypeId) {
      return "NEED PARAMS ID OR SORT_TYPE_ID";
    }
    req.query = class_transformer.plainToClass(req.query, Goods) as any;
  }
}
export {
    LogInterCeptor
}