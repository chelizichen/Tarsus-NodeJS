import { Request,Response,NextFunction } from "express"
import _ from "lodash";
import { setName, RxConstant } from "./define";
(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");

interface TarsusGlobalPipe{
    handle(req:Request,res:Response,next:NextFunction):void
}
interface TarsusPipe{
    handle(req:Request):any;
}

const UsePipe = (tarsuPipe:TarsusPipe) =>{
    return function (value:any,context:ClassMethodDecoratorContext){
        _.set(context.metadata,setName(RxConstant.__rx__pipe__,context.name),tarsuPipe)
    }
}


export{
    TarsusPipe,UsePipe,TarsusGlobalPipe
}

