import express, {Express} from "express";
import load_config, {config_enum} from "../load_config/load_config";
import {parseToObj, ServantUtil} from "../../util/servant";

import load_data from "../load_data/load_data";
import {EventEmitter} from "events";

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
    http_config:parseToObj;
}

enum Emits{
    INIT="init",
    START="start"
}


const load_web_app: loadWebApp = {
    app: void "express signal instance",
    router: express.Router(),
    global_pipe: void "express global pipe",
    before_listen: void "use callback function before listen",
    events: new EventEmitter(),
    http_config:void "http config for web application",
    init: function () {
        load_web_app.app = express();
        const app = load_web_app.app;
        app.use(express.json())

        load_web_app.events.on(Emits.START,function (){
            console.log("before start",load_web_app.http_config)
            load_web_app.app.listen(load_web_app.http_config.port, function () {
                console.log(`server is started at localhost:${load_web_app.http_config.port}`)
            })
        })
        load_web_app.events.on(Emits.INIT,async function (config: initConfig){
            load_config.init();
            const get_config = load_config.get_config;
            await load_data.init(get_config(config_enum.database))
            // create a express instance


            // we can load microservice when we start a web or gateway application
            if (config.load_ms) {
                const servant = get_config(config_enum.servant);
                load_web_app.load_servant(servant)
            }

            load_web_app.load_global_pipe();
            load_web_app.load_router();

            const http_config: parseToObj = ServantUtil.parse(get_config(config_enum.project));
            load_web_app.http_config = http_config;

            load_web_app.before_listen(app);

            load_web_app.events.emit(Emits.START)

        })
    },
    load_servant: function () {

    },

    load_global_pipe: function () {
        // load global pipe
        if(!load_web_app.global_pipe){
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
    load_web_app.router = controllers;
}

function LoadInit(callBack?: (app: express.Express) => void) {
    // set init before listening port
    function voidCallBack(){

    }
    load_web_app.before_listen = callBack || voidCallBack;
}

function LoadServer(config: initConfig) {
    load_web_app.events.emit(Emits.INIT,config);
}


export default load_web_app
export {
    LoadServer,LoadController,LoadInit,LoadGlobalPipe
}