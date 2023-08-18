import {Load_Balance} from "./load_balance";
import {Response, Request} from "express";

let load_proto = {
    // 微服务网关所需要的代理层
    set_servant(key: string, value: Load_Balance) {
        load_proto.servant_maps.set(key, value)

    },
    servant_maps: new Map<string, Load_Balance>(),
    get_servant(key: string) {
        return load_proto.servant_maps.get(key)
    },
    transmit(req: Request, res: Response) {
        let {body, query} = req;
        let merge = Object.assign({}, body, query)
        const {proxy} = merge;
        const load_balance = load_proto.get_servant(proxy)
        debugger;
        load_balance.ProxySendRequest(merge, res)
    }
}
let $Transmit = load_proto.transmit;


export {
    $Transmit
}
export default load_proto