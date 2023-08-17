import {ServantUtil} from "../../util";
import {Load_Balance} from "./load_balance";
import {Response, Request} from "express";

import load_data from "../load_data/load_data";

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

async function getMsServer() {

    const data = await load_data.rds.SMEMBERS(this.servantGroup);
    console.log("加载所有的微服务模块", data);

    let group_microservice: Record<string, Array<any>> = data.reduce((groups, obj) => {
        let toObj = ServantUtil.parse(obj)
        const project = toObj.serverProject;

        if (!groups[project]) {
            groups[project] = [];
        }

        groups[project].push(toObj);
        return groups;
    }, {})


    console.log('group_microservice', group_microservice);

    for (let v in group_microservice) {
        const loadBalance = new Load_Balance(group_microservice[v], v);
        load_proto.set_servant(v, loadBalance)
    }
}

export default load_proto