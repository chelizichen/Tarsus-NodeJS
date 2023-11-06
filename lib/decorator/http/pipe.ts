import { Request,Response,NextFunction } from "express"
import { TarsusError } from "./error";

interface TarsusGlobalPipe{
    next(req:Request,res:Response,next:NextFunction):void
}
interface TarsusPipe{
    handle(req:Request):any;
}

const UsePipe = (tarsuPipe:TarsusPipe) =>{
    return function (value:any,context:ClassMethodDecoratorContext){
        async function interceptor_func<This = unknown>(this: This, ...args: any[]) {
            const pipeRet = await tarsuPipe.handle.call(this, ...args);
            if(pipeRet instanceof Error || pipeRet instanceof TarsusError){
                return pipeRet;
            };
            const data = await value.call(this, ...args)
            return data
        };
        return interceptor_func;
    }
}


export{
    TarsusPipe,UsePipe,TarsusGlobalPipe
}

