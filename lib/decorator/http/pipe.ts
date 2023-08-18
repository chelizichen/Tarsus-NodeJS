import { Request,Response,NextFunction } from "express"

interface TarsusGlobalPipe{
    next(req:Request,res:Response,next:NextFunction):void
}

interface TarsusPipe{
    next(req:Request):void
}

const UsePipe = () =>{

}

export{
    TarsusPipe,UsePipe,TarsusGlobalPipe
}

