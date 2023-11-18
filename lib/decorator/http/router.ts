import load_web_app from "../../main_control/load_server/load_web_app";
import {Request, Response} from 'express';
import { TarsusError } from "./error";
import _ from 'lodash';
import { catchError, concatMap, from, scan, throwError,takeWhile } from "rxjs";
(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");

export enum METHODS {
    GET = "get",
    POST = "post",
    INVOKE = "all",
    PUT = 'put'
}

function create_url(interFace: string, method: string): string {
    interFace = interFace.startsWith("/") ? interFace : `/${interFace}`;
    method = method.startsWith("/") ? method : `/${method}`;
    return `${interFace}${method}`;
}



function EmptyFunction(){}
function RxDone(){
    return {
        iCode:0,
        iMessage:'ok'
    }
}
function methods_factory(type: METHODS) {
    return function (url: string) {
        let router = load_web_app.router;
        return (func: any, context: ClassMethodDecoratorContext) => {
            context.addInitializer(function () {
                const httphandleStream = [
                    {key:"__rx__interceptor__",value:'handle.call'},
                    {key:"__rx__pipe__",value:"handle.call"},
                    {key:"__rx__router__",value:undefined}
                ];
                Object.freeze(httphandleStream); // 冻结
                const handleHttpObserve = from(httphandleStream);
                let current_route = create_url(context.metadata.interFace as string, url);
                func = func.bind(this);
                if (type === METHODS.INVOKE) {
                    _.invoke(router,type,...[current_route, async (req:Request, res:Response) => {
                        func(req, res);
                    }])
                } else {
                    _.invoke(router,type,...[current_route, async (req:Request, res:Response) => {
                        _.set(context.metadata,"__request__",req)
                        _.set(context.metadata,"__response__",res)
                        const stream = handleHttpObserve.pipe(
                            concatMap(async (Obj) => {
                                try{
                                    const {key,value} = Obj;
                                    if(key === "__rx__router__"){
                                        const data = await func(req,res)
                                        _.set(context.metadata,'__rx__resp__',data)
                                        return data;
                                    }else{
                                        const fn = (_.get(context.metadata,key) || EmptyFunction) as Function
                                        await _.invoke(fn,value,...[this,req,res]);
                                    }
                                }catch(error){
                                    _.set(context.metadata,'__rx__resp__',error)
                                    return error
                                }
                            }),
                            takeWhile(result => !(_.isError(result))),
                            scan((accumulator, currentValue) => [...accumulator, currentValue], []), // 使用 scan 累积结果
                            catchError(error => {
                                return throwError(()=>{
                                    _.set(context.metadata,'__rx__resp__',error)
                                    return error
                                });
                            })
                        )
                        stream.subscribe({
                            next(v){
                                console.log(v);
                            },
                            error(data){
                                const RESP = data || _.get(context.metadata,'__rx__resp__')
                                if((RESP instanceof TarsusError || RESP instanceof Error)){
                                    (RESP as TarsusError).iCode = (RESP as TarsusError).iCode || -19;
                                    (RESP as TarsusError).iMessage = (RESP as TarsusError).iMessage || 'uncaught error'
                                }
                                res.send(RESP)
                            },
                            complete(){
                                const iDATA = RxDone();
                                const iRESP = _.get(context.metadata,'__rx__resp__')
                                res.send(Object.assign({},iDATA,iRESP))
                            }
                        });
                    }])
                }
            });
        };
    };
}

const Get = methods_factory(METHODS.GET)
const Post = methods_factory(METHODS.POST)
const Put = methods_factory(METHODS.PUT)

const INVOKE = methods_factory(METHODS.INVOKE)

const Controller = (interFace: string) => {
    return function (controller: new () => any, context: ClassDecoratorContext) {
        _.set(context.metadata,'interFace',interFace)
    };
};


export {Get, Post, Put, INVOKE, Controller};
