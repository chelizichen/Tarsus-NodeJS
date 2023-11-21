import { NextFunction, Request, Response } from "express";
import { TarsusGlobalPipe } from "../../../../lib/httpservice";

class Logger implements TarsusGlobalPipe{
    handle(req:Request,res:Response,next:NextFunction){
        const data = Object.assign({},req.query,req.body)
        console.log('params',JSON.stringify(data));
    }
}

export default Logger;