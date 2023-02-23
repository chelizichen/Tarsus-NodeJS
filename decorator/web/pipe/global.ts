import { Request,Response,NextFunction } from "express"
import { Application, ApplicationEvents } from "../application"
interface TarsusGlobalPipe{
    next(req:Request,res:Response,next:NextFunction):void
}



function loadGlobalPipe(args:Array<new ()=>TarsusGlobalPipe>){
    ApplicationEvents.emit(Application.LOAD_PIPE,args);
}
export {
    TarsusGlobalPipe,loadGlobalPipe
}