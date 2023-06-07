import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { TarsusInterCeptor } from "../../../decorator";
import { class_transformer } from "../../../decorator";
import {Fund} from "../entity/fund";

class LogInterCeptor implements TarsusInterCeptor {
  handle(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>
  ): any {
    const { id } = req.query;
    if (!id) {
      return "NEED PARAMS ID OR SORT_TYPE_ID";
    }
    req.query = class_transformer.plainToClass(req.query, Fund) as any;
  }
}
export {
    LogInterCeptor
}