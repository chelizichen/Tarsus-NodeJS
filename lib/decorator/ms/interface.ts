import load_ms_app from "../../main_control/load_server/load_ms_app";
import Interface_Events from "../../main_control/proto_base/interface_events";
import stream_proxy from "../../main_control/proto_base/taro_proxy";
import { nextTick } from "process";

import httpproxy from '../../main_control/proto_base/proxy_call'
import Receive_Data from "../../main_control/proto_base/receive_data";

const TarsusEvents = load_ms_app.interface_events

const TarsusMethod = (value: (...args: any[]) => Promise<any>, context: any) => {
    context.addInitializer(function () {
        const fn_name = Interface_Events.get_fn_name(this.interFace, context.name);
        value = value.bind(this)
        TarsusEvents.register(fn_name, value)
    });
};

const TarsusInterFace = (interFace: string) => {
    return function (classValue: any, context: ClassDecoratorContext) {
        classValue.prototype.interFace = interFace;
    };
};

function Stream(request: string, response: string) {
    return function (value: (...args: any[]) => any, context: ClassMethodDecoratorContext) {
        context.addInitializer(function () {
            nextTick(() => {
                // 注册 interFace ， request ，response
                // @ts-ignore
                const getHead = `[#1]${this.interFace}[#2]${context.name}`;
                stream_proxy.StreamMap[getHead] = {
                    request,
                    response,
                };
            })
        })
    }
}

/**
 * 
 * @param proxy 代理的服务
 * @param reflect 代理的接口
 * @returns 
 */
const TarsusReflect = (proxy: string, reflect: string) => {
    return function <TFunction extends Function>(value: TFunction, context: ClassDecoratorContext<any>) {
        let reflect$methods = Object.keys(value.prototype)
        for (let index = 0; index < reflect$methods.length; index++) {
            const element = reflect$methods[index];
            value.prototype[element] = async function (data: any, resp: any) {
                const request = {
                    interFace: reflect,
                    proxy: proxy,
                    method: element,
                    request: data.__proto__.name,
                    data,
                }

                const ret = await Receive_Data.CrossRequest(request);
                return ret
                // 暂时不用Http调用 目测可以使用 没测过
                // const ret = await httpproxy({
                //     data: request,
                //     method: 'post',
                // })
                // return ret;
            }
        }
    }
}

const UseImpl = (injectAble:new (...args:any[])=>any)=>{
    return (value: any, context: ClassFieldDecoratorContext) => {
        if (context.kind !== "field") {
            return;
        }
        return function () {
            if(!load_ms_app.implCollects.get(injectAble.prototype)){
                const interFace_inst = new injectAble()   
                load_ms_app.implCollects.set(injectAble.prototype,interFace_inst)
            }
            let injectAbleClass = load_ms_app.implCollects.get(injectAble.prototype);
            return injectAbleClass;
        };
    };
}

export {
    TarsusInterFace,
    TarsusMethod,
    Stream,
    TarsusReflect,
    UseImpl
};