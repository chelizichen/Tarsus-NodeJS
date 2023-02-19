import { Request } from "express"

interface ArcPipe{
    next(req:Request):void
}

const UsePipe = () =>{

}

export{
    ArcPipe,UsePipe
}