import load_config, {config_enum} from "../load_config/load_config";
import {parseToObj, ServantUtil} from "../../util/servant";
import {EventEmitter} from "events";
import Interface_Events from "../proto_base/interface_events";

enum Emits {
    INIT = "init",
    START = "start",
    INTERFACE = "interface",
    TARO = "taro",
}

function LoadInterface(interfaces: any[]) {
    load_ms_app.interfaces = interfaces;
    load_ms_app.events.on(Emits.INTERFACE, function () {
        if (!load_ms_app.interfaces.length) {
            return
        }
        for (let i = 0; i < load_ms_app.interfaces.length; i++) {
            const interFace = load_ms_app.interfaces[i];
            let interFace_inst = new interFace();
            console.log(interFace_inst.interFace)
        }
    })
}

function LoadTaro(taro_modules:any[]){
    load_ms_app.taro = taro_modules;
    load_ms_app.events.on(Emits.TARO, function () {
        console.log(load_ms_app.taro)
    })
}

let load_ms_app = {
    init: function () {
        load_config.init();
        const get_config = load_config.get_config;
        const ms_config: parseToObj = ServantUtil.parse(get_config(config_enum.project));
        load_ms_app.events.emit(Emits.INTERFACE)
        load_ms_app.events.emit(Emits.TARO)
    },
    events: new EventEmitter(),
    interfaces: void 'rpc interfaces',
    taro:void  'taro struct',
    interface_events:new Interface_Events()
}

export default load_ms_app;