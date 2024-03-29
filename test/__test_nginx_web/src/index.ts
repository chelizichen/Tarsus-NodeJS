import TarsusHttpApplication from "../../../lib/decorator/app/http";
import {LoadController, LoadInit, LoadServer, LoadStruct, LoadTaro} from "../../../lib/main_control/load_server/load_web_app";
import OrmController from "./controller/OrmController";
import UserController from "./controller/UserController";
import ValidateController from "./controller/ValidateControrller";
import Logger from "./pipe/GlobalPipe";

@TarsusHttpApplication
class HttpServer{
    static main(){
        LoadController([UserController,ValidateController,OrmController])
        // init
        LoadInit((app)=>{
            console.log("hello world")
        });
        LoadStruct()
        LoadTaro()
        // load
        LoadServer({
            load_ms:false
        })
    }
}

HttpServer.main()