import { Request,Response,NextFunction } from "express"

interface TarsusGlobalPipe{
    next(req:Request,res:Response,next:NextFunction):void
}

export {
    TarsusGlobalPipe
}