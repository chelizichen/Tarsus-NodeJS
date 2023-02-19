import { Request,Response,NextFunction } from "express"
import { Application, ApplicationEvents } from "../application"
interface ArcGlobalPipe{
    next(req:Request,res:Response,next:NextFunction):void
}



function loadGlobalPipe(args:Array<new ()=>ArcGlobalPipe>){
    ApplicationEvents.emit(Application.LOAD_PIPE,args);
}
export {
    ArcGlobalPipe,loadGlobalPipe
}