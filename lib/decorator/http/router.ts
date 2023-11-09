import load_web_app from "../../main_control/load_server/load_web_app";
import {Request, Response} from 'express';
import { TarsusError } from "./error";
import _ from 'lodash';
(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");

export enum METHODS {
    GET = "get",
    POST = "post",
    INVOKE = "all",
}

function create_url(interFace: string, method: string): string {
    if (!interFace.startsWith("/")) {
        interFace = "/" + interFace;
    }
    if (!method.startsWith("/")) {
        method = "/" + method
    }
    return interFace + method;
}

function methods_factory(type: METHODS) {
    return function (url: string) {
        let router = load_web_app.router;
        return (func: any, context: ClassMethodDecoratorContext) => {
            context.addInitializer(function () {
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
                        try{
                            const data = await func(req,res);
                            if((data instanceof TarsusError || data instanceof Error)){
                                (data as TarsusError).iCode = (data as TarsusError).iCode || -19;
                                (data as TarsusError).iMessage = (data as TarsusError).iMessage || 'uncaught error'
                            }
                            if (!res.destroyed) {
                                res.json(data);
                            }
                        }catch(e){
                            if (!res.destroyed) {
                                res.json(e)
                            }
                        }
                    }])
                }
            });
        };
    };
}

const Get = methods_factory(METHODS.GET)
const Post = methods_factory(METHODS.POST)

const INVOKE = methods_factory(METHODS.INVOKE)

const Controller = (interFace: string) => {
    return function (controller: new () => any, context: ClassDecoratorContext) {
        _.set(context.metadata,'interFace',interFace)
    };
};


export {Get, Post, INVOKE, Controller};
