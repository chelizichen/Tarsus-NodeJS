import axios from "axios";
import load_config, { config_enum } from "../load_config/load_config";
import {EventEmitter} from "events";
import load_proto from "./index";
import Data_forward from "./data_forward";
import {Load_Balance} from "./load_balance";
import {call} from "../../decorator/http/call";

let httpproxy =void 'axios request';

setImmediate(() => {
    // 此处必须填写对应的 servant的网关 地址
    const proxy_url = load_config.get_config(config_enum.proxy)
    httpproxy = axios.create({
        baseURL: proxy_url,
        timeout: 50000,
        headers: { "Content-Type": "application/json;charset=utf-8" },
    });
})

enum crossEnum{
    sendRequest="send",
}

let crossproxy = new EventEmitter();

crossproxy.on(crossEnum.sendRequest,function (eid:string,body:Buffer,isJava:boolean){
    // 跨服务协议包含 请求eid 服务proxy名 数据 stf
    const proxy = body.subarray(0,16).toString().replace(/\0/g, '');;
    const stf = body.subarray(16,body.length).toString();
    const load_balance:Load_Balance = load_proto.get_servant(proxy)
    const data_forward = load_balance.hostList[0];
    // 如果是Java，则需要进行反序列化和校准参数
    if(isJava){
        const data = JSON.parse(stf);
        const stream = call(data)
        data_forward.service.write(eid,stream)
        return;
    }
    // 代理服务写入数据
    data_forward.service.write(eid,stf)
})

export {
    crossproxy,
    crossEnum
}

export default httpproxy

