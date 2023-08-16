import load_ms_app from "../../load_server/load_ms_app";
import Interface_Events from "../../proto_base/interface_events";
import stream_proxy from "../../proto_base/taro_proxy";
import {nextTick} from "process";

const interFaceMaps = new Map();
const TarsusEvents = load_ms_app.interface_events

const TarsusMethod = (value: (...args:any[])=>Promise<any>, context: any) => {
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

function Stream(request:string,response:string) {
    return function (value:(...args:any[])=>any,context:ClassMethodDecoratorContext) {
        context.addInitializer(function () {
            nextTick(()=>{
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

export { TarsusInterFace, TarsusMethod, interFaceMaps,Stream };