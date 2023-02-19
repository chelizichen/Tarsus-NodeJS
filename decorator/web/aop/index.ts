import { Request,Response } from "express";

function UseInterCeptor(interceptor:ArcInterCeptor){
    return function (value:any,context:ClassMethodDecoratorContext){
        let copy_value = value;
        value = async function (req:Request){
            // @ts-ignore
            const data =  await interceptor.handle.call(this,req)
            if(data){
                return data;
            }else{
            // @ts-ignore
                const data = await copy_value.call(this,req)
                return data
            }
        }
        return value
    }
}

interface ArcInterCeptor{
    handle(req:Request):any;
}

export {
    UseInterCeptor,ArcInterCeptor
}