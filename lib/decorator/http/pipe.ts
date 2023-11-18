import { Request,Response,NextFunction } from "express"
import _ from "lodash";
(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");

interface TarsusGlobalPipe{
    handle(req:Request,res:Response,next:NextFunction):void
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

