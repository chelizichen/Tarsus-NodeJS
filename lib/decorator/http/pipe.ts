import { Request,Response,NextFunction } from "express"

interface TarsusGlobalPipe{
    next(req:Request,res:Response,next:NextFunction):void
}

interface TarsusPipe{
    next(req:Request):void
}

const UsePipe = (tarsuPipe:TarsusPipe) =>{
    return function (value:any,context:ClassMethodDecoratorContext){
        async function interceptor_func<This = unknown>(this: This, ...args: any[]) {
            const data = await tarsuPipe.handle.call(this, ...args)
            if (data && data !== null) {
                return data
            } else {
                let data = await value.call(this, ...args)
                return data
            }
        };
        return interceptor_func;
    }
}

interface TarsusPipe{
    handle(req:Request):any;
}

export{
    TarsusPipe,UsePipe,TarsusGlobalPipe
}

