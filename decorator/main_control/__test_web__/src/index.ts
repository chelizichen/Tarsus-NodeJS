import TarsusHttpApplication from "../../decorator/app/http";
import {LoadController, LoadInit, LoadServer} from "../../load_server/load_web_app";
import UserController from "./controller/UserController";

// 启动服务从初始化开始
@TarsusHttpApplication
class HttpServer{
    static main(){
        LoadController([UserController])
        // init
        LoadInit();
        // load
        LoadServer({
            load_ms:false
        })
    }
}

HttpServer.main()