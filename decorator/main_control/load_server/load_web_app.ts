import express, {Express} from "express";
import load_config, {config_enum} from "../load_config/load_config";
import {parseToObj, ServantUtil} from "../../util/servant";

import load_data from "../load_data/load_data";
import {EventEmitter} from "events";
import {Load_Balance} from "../proto_base/load_balance";
import load_proto from "../proto_base";
import path from "path";
import {cwd} from "process";
import {readdirSync} from "fs";
import stream_proxy from "../proto_base/taro_proxy";

type void_func = (...args: any[]) => void;

type initConfig = {
    load_ms: boolean
}

type loadWebApp = {
    app: Express;
    init: void_func;
    events: EventEmitter;
    // load all registry microservice
    load_servant: void_func;
    load_global_pipe: void_func;
    load_router: void_func;
    before_listen: any;
    global_pipe: any[];
    router: express.Router;
    http_config: parseToObj;
}

enum Emits {
    INIT = "init",
    START = "start",
    TARO = "taro",
    STRUCT = "struct"
}

export function LoadTaro(url?: string) {
    load_web_app.events.on(Emits.TARO, function () {
        const taro_path = url || "src/taro";
        const full_path = path.resolve(cwd(), taro_path);
        const dirs = readdirSync(full_path);
        dirs.forEach((interFace) => {
            let taro_path = path.resolve(full_path, interFace);
            // 将会存储到 TarsusStream 的 Map 里
            stream_proxy.SetStream(taro_path);
        });
    })
}

export function LoadStruct(url?: string) {
    load_web_app.events.on(Emits.STRUCT, function () {
        const struct_path = url || "src/struct";
        const full_path = path.resolve(cwd(), struct_path);
        const dirs = readdirSync(full_path);
        dirs.forEach((interFace) => {
            let interFace_path = path.resolve(full_path, interFace);
            const singalClazz = require(interFace_path);
            for (let v in singalClazz) {
                stream_proxy.TarsusStream.define_struct(singalClazz[v]);
            }
        });
    })
}


const load_web_app: loadWebApp = {
    app: void "express signal instance",
    router: express.Router(),
    global_pipe: void "express global pipe",
    before_listen: void "use callback function before listen",
    events: new EventEmitter(),
    http_config: void "http config for web application",
    init: function () {
        load_web_app.app = express();
        const app = load_web_app.app;
        app.use(express.json())
        app.set('view engine', 'html');
        load_web_app.events.on(Emits.START, function () {
            console.log("before start", load_web_app.http_config)
            load_web_app.app.listen(load_web_app.http_config.port, function () {
                console.log(`server is started at localhost:${load_web_app.http_config.port}`)
            })
        })
        load_web_app.events.on(Emits.INIT, async function (config: initConfig) {
            load_config.init();
            const get_config = load_config.get_config;
            await load_data.init(get_config(config_enum.database))
            // create a express instance


            // we can load microservice when we start a web or gateway application
            if (config.load_ms) {
                const servant = get_config(config_enum.servant);
                console.log("***************开启网关*******************")
                load_web_app.load_servant(servant)
            }

            load_web_app.load_global_pipe();
            load_web_app.load_router();

            const http_config: parseToObj = ServantUtil.parse(get_config(config_enum.project));
            load_web_app.http_config = http_config;

            load_web_app.before_listen(app);

            load_web_app.events.emit(Emits.START)

            load_web_app.events.emit(Emits.TARO)
            load_web_app.events.emit(Emits.STRUCT)

        })
    },
    load_servant: function (servant: string[]) {
        const servant_array: parseToObj[] = servant.map(item => ServantUtil.parse(item));
        const get_servant_group = {}
        for (let i = 0; i < servant_array.length; i++) {
            let item = servant_array[i]
            let server_name = item.serverProject
            if(!get_servant_group[server_name]){
                get_servant_group[server_name] = []
            }
            get_servant_group[server_name].push(item)
        }

        for (let i in get_servant_group){
            const servants = get_servant_group[i]
            const load_balance = new Load_Balance(servants,i);
            load_proto.set_servant(i,load_balance)
        }
        console.log('parse_server',get_servant_group)
        console.log("***************开启网关*******************")

    },

    load_global_pipe: function () {
        // load global pipe
        if (!load_web_app.global_pipe) {
            return
        }
        load_web_app.global_pipe.forEach((Pipe) => {
            let pipe = new Pipe();
            load_web_app.app.use("*", (...args: any[]) => pipe.next(args));
        });
    },

    load_router: function () {
        load_web_app.app.use(load_web_app.router);
    },
}

function LoadGlobalPipe(...args: any[]) {
    load_web_app.global_pipe = args;
}

function LoadController(controllers: any) {
    if (controllers.length) {
        for (let i = 0; i < controllers.length; i++) {
            // console.log(controllers)
            let controller = controllers[i]
            const controller_inst = new controller();
            console.log(controller_inst.interFace, "is loading success")
        }
    }
}

function LoadInit(callBack?: (app: express.Express) => void) {
    // set init before listening port
    function voidCallBack() { }

    load_web_app.before_listen = callBack || voidCallBack;
}

function LoadServer(config: initConfig) {
    load_web_app.events.emit(Emits.INIT, config);
}


export default load_web_app
export {
    LoadServer, LoadController, LoadInit, LoadGlobalPipe
}