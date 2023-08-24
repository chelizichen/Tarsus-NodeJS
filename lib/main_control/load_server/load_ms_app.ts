import load_config, {config_enum} from "../load_config/load_config";
import {parseToObj, ServantUtil} from "../../util/servant";
import {EventEmitter} from "events";
import Interface_Events from "../proto_base/interface_events";
import path from "path";
import {cwd} from "process";
import {readdirSync} from "fs";
import stream_proxy from "../proto_base/taro_proxy";
import {nextTick} from "process";
import Receive_Data from "../proto_base/receive_data";
import load_data from "../load_data/load_data";

export enum Emits {
    INIT = "init",
    START = "start",
    INTERFACE = "interface",
    TARO = "taro",
    STRUCT = "struct"
}


function LoadInterface(interfaces: any[]) {
    load_ms_app.interfaces = interfaces;
    load_ms_app.events.on(Emits.INTERFACE, function () {
        if (!load_ms_app.interfaces.length) {
            return
        }
        for (let i = 0; i < load_ms_app.interfaces.length; i++) {
            const interFace = load_ms_app.interfaces[i];
            // 已有 直接return
            if(load_ms_app.implCollects.get(interFace.prototype)){
                continue
            }
            let interFace_inst = new interFace();
            load_ms_app.implCollects.set(interFace.prototype,interFace_inst);
            console.log(interFace_inst.interFace, " is load success")
        }
    })
}

function LoadTaro(url?: string) {
    load_ms_app.events.on(Emits.TARO, function () {
        const taro_path = url || "src/taro";
        const full_path = path.resolve(cwd(), taro_path);
        const dirs = readdirSync(full_path);
        dirs.forEach((interFace) => {
            let taro_path = path.resolve(full_path, interFace);
            // 将会存储到 TarsusStream 的 Map 里
            stream_proxy.SetStream(taro_path);
            console.log("taro_path - ", taro_path, ' - is load success')
        });
    })
}

function LoadStruct(url?: string) {
    load_ms_app.events.on(Emits.STRUCT, function () {
        const struct_path = url || "src/struct";
        const full_path = path.resolve(cwd(), struct_path);
        const dirs = readdirSync(full_path);
        dirs.forEach((interFace) => {
            let interFace_path = path.resolve(full_path, interFace);
            console.log("struct_path - ", interFace_path, '- is load success')
            const singalClazz = require(interFace_path);
            for (let v in singalClazz) {
                stream_proxy.TarsusStream.define_struct(singalClazz[v]);
            }
        });
    })
}

function LoadServer() {
    load_ms_app.events.emit(Emits.START)
}

let load_ms_app = {
    init: function () {
        load_config.init();
        const get_config = load_config.get_config;
        load_data.init(get_config(config_enum.database))
        const ms_config: parseToObj = ServantUtil.parse(get_config(config_enum.project));
        load_ms_app.config = ms_config;

        load_ms_app.events.on(Emits.INIT, function () {
            load_ms_app.events.emit(Emits.INTERFACE)
            load_ms_app.events.emit(Emits.TARO)
            load_ms_app.events.emit(Emits.STRUCT)
        })

        // 执行START 后，会执行INIT方法
        load_ms_app.events.on(Emits.START, async function () {
            load_ms_app.events.emit(Emits.INIT)
            nextTick(() => {
                const {port, host} = load_ms_app.config
                load_ms_app.tcpConn =  new Receive_Data({
                    port: Number(port),
                    host: host,
                })
            })

        })
    },
    events: new EventEmitter(),
    interfaces: void 'rpc interfaces',
    taro: void 'taro struct',
    interface_events: new Interface_Events(),
    config: <parseToObj>void 'ms config',
    tcpConn:<Receive_Data> void "tcp链接实例",
    implCollects: new WeakMap()
}

export default load_ms_app;
export {
    LoadInterface,
    LoadTaro,
    LoadStruct,
    LoadServer
}