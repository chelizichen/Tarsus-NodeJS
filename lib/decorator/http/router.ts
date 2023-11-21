import load_web_app from "../../main_control/load_server/load_web_app";
import {Request, Response} from 'express';
import { DecoratorError, TarsusError } from "./error";
import _ from 'lodash';
import { catchError, concatMap, from, scan, throwError,takeWhile } from "rxjs";
import { RxConstant, setName } from "./define";
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
                const RxJwtController = RxConstant.__rx__controller__jwt__;
                const RxJwtMethod = setName(RxConstant.__rx__controller__jwt__,context.name);
                const RxMethodInterceptor = setName(RxConstant.__rx__interceptor__,context.name);
                const RxMethodPipe = setName(RxConstant.__rx__pipe__,context.name);
                const RxRouter = setName(RxConstant.__rx__router__,context.name);
                const RxResp = setName(RxConstant.__rx__resp__,context.name);
                const RxRequest = setName(RxConstant.__request__,context.name);
                const RxResponse = setName(RxConstant.__response__,context.name);
                const hasControllerJwt = _.get(context.metadata,RxJwtController);
                const hasMethodJwt = _.get(context.metadata,RxJwtMethod);
                const httphandleStream = [
                    {key:RxMethodInterceptor,value:'handle.call'},
                    {key:RxMethodPipe,value:"handle.call"},
                    {key:RxRouter,value:undefined}
                ];
                if(hasControllerJwt && hasMethodJwt) throw DecoratorError("jwt 控制层校验不能与方法层校验同时存在")
                if(hasControllerJwt) httphandleStream.unshift({key:RxJwtController,value:'handle.call'})
                if(hasMethodJwt) httphandleStream.unshift({key:RxJwtMethod,value:'handle.call'})

                Object.freeze(httphandleStream); // 冻结
                const handleHttpObserve = from(httphandleStream);
                let current_route = create_url(context.metadata.interFace as string, url);
                console.log(current_route,httphandleStream);
                func = func.bind(this);
                if (type === METHODS.INVOKE) {
                    _.invoke(router,type,...[current_route, async (req:Request, res:Response) => {
                        func(req, res);
                    }])
                } else {
                    _.invoke(router,type,...[current_route, async (req:Request, res:Response) => {
                        _.set(context.metadata,RxRequest,req)
                        _.set(context.metadata,RxResponse,res)
                        const stream = handleHttpObserve.pipe(
                            concatMap(async (Obj) => {
                                try{
                                    const {key,value} = Obj;
                                    if(key === RxRouter){
                                        const data = await func(req,res)
                                        _.set(context.metadata,RxResp,data)
                                        return data;
                                    }else{
                                        const fn = (_.get(context.metadata,key) || EmptyFunction) as Function
                                        await _.invoke(fn,value,...[this,req,res]);
                                    }
                                }catch(error){
                                    _.set(context.metadata,RxResp,error)
                                    return error
                                }
                            }),
                            takeWhile(result => !(_.isError(result))),
                            scan((accumulator, currentValue) => [...accumulator, currentValue], []), // 使用 scan 累积结果
                            catchError(error => {
                                return throwError(()=>{
                                    _.set(context.metadata,RxResp,error)
                                    return error
                                });
                            })
                        )
                        stream.subscribe({
                            next(v){
                                // console.log(v);
                            },
                            error(data){
                                const RESP = data || _.get(context.metadata,RxResp)
                                if((RESP instanceof TarsusError || RESP instanceof Error)){
                                    (RESP as TarsusError).iCode = (RESP as TarsusError).iCode || -19;
                                    (RESP as TarsusError).iMessage = (RESP as TarsusError).iMessage || 'uncaught error'
                                }
                                res.send(RESP)
                            },
                            complete(){
                                const iDATA = RxDone();
                                const iRESP = _.get(context.metadata,RxResp)
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
