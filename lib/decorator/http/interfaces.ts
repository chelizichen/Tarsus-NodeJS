import { Request, Response, NextFunction } from "express";

interface TarsusGlobalPipe{
    handle(req:Request,res:Response,next:NextFunction):void
}
interface TarsusPipe{
    handle(req:Request):any;
}

interface TarsusJwtValidate{
    handle(req:Request):Promise<void>;
}

interface TarsusInterceptor{
    handle(req:Request):any;
}


export {
    TarsusGlobalPipe,
    TarsusPipe,
    TarsusJwtValidate,
    TarsusInterceptor
}