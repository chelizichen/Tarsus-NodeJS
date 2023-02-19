import { Request,Response } from "express";

function UseInterCeptor(interceptor:ArcInterCeptor){
    return function (value:any,context:ClassMethodDecoratorContext){
        let copy_value = value;
        value = async function (req:Request){
            // @ts-ignore
            const data =  await interceptor.hijack.call(this,req)
            if(data){
                console.log("执行拦截器");
                return data;
            }else{
                console.log("执行业务");
            // @ts-ignore
                const data = await copy_value.call(this,req)
                return data
            }
        }
        return value
    }
}

interface ArcInterCeptor{
    hijack(req:Request):any;
}

export {
    UseInterCeptor,ArcInterCeptor
}