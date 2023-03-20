import { Request,Response } from "express";

function UseInterCeptor(interceptor:TarsusInterCeptor){
    return function (value:any,context:ClassMethodDecoratorContext){
        async function intercepotorFn<This = unknown>(this: This, ...args: any[]) {
            const data = await interceptor.handle.call(this, ...args)
            if (data) {
                return data
            } else {
                let data = value.call(this, ...args)
                return data
            }
        };
        return intercepotorFn;
    }
}

interface TarsusInterCeptor{
    handle(req:Request):any;
}

export {
    UseInterCeptor,TarsusInterCeptor
}