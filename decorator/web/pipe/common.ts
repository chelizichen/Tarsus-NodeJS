import { Request } from "express"

interface TarsusPipe{
    next(req:Request):void
}

const UsePipe = () =>{

}

export{
    TarsusPipe,UsePipe
}