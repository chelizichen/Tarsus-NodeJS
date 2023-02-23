import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { TarsusGlobalPipe } from "../../../decorator/web/pipe";

class LogGlobalPipe implements TarsusGlobalPipe {
  next(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): void {
    console.log(req.query);
    console.log(req.body);
    next();
  }
}

export {
    LogGlobalPipe
}