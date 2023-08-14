import TarsusHttpApplication from "../../decorator/app/http";
import {LoadController, LoadInit, LoadServer} from "../../load_server/load_web_app";
import UserController from "./controller/UserController";

@TarsusHttpApplication
class HttpServer{
    static main(){
        LoadController([UserController])
        // init
        LoadInit((app)=>{
            console.log("hello world")
        });
        // load
        LoadServer({
            load_ms:false
        })
    }
}

HttpServer.main()