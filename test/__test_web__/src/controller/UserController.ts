import {Controller, Get, INVOKE} from "../../../../lib/decorator/http/router";
import {Limit, limit_type} from "../../../../lib/decorator/interceptor/Limit";
import Ret from '../utils/ret'
import { $Transmit } from "../../../../lib/main_control/proto_base";
@Controller("/user")
class UserController {

    @Get("/list")
    getUserList(req) {
        return Ret.success("hello world")
    }

    @INVOKE("/invoke")
    invoke(req,res){
        debugger;
        $Transmit(req,res);
    }

    @Get("/limit_test")
    @Limit(limit_type.ALL,10,60) // 60秒内十次最大限制
    async limitTest(){
        return ""
    }
}

export default UserController;