import { Request,Response,NextFunction } from "express"
import _ from "lodash";
import { setName, RxConstant } from "./define";
import { TarsusPipe } from "./interfaces";
(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");



const UsePipe = (tarsuPipe:TarsusPipe) =>{
    return function (value:any,context:ClassMethodDecoratorContext){
        _.set(context.metadata,setName(RxConstant.__rx__pipe__,context.name),tarsuPipe)
    }
}


export{
    UsePipe
}

