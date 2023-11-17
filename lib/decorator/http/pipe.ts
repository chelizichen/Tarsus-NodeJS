import { Request,Response,NextFunction } from "express"
import { TarsusError } from "./error";
import _ from "lodash";

interface TarsusGlobalPipe{
    next(req:Request,res:Response,next:NextFunction):void
}
interface TarsusPipe{
    handle(req:Request):any;
}

const UsePipe = (tarsuPipe:TarsusPipe) =>{
    return function (value:any,context:ClassMethodDecoratorContext){
        _.set(context.metadata,"__rx__pipe__",tarsuPipe)
    }
}


export{
    TarsusPipe,UsePipe,TarsusGlobalPipe
}

