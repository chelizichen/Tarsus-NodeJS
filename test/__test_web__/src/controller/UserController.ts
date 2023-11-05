import {Controller, Get, INVOKE, Post} from "../../../../lib/decorator/http/router";
import {Limit, limitType} from "../../../../lib/decorator/interceptor/Limit";
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
    @Limit(limitType.ROUTER,2,10000) // 10秒内2次最大限制 单个路由
    async limitTest(req,res){
        return {
            code:0,
            message:"success"
        }
    }

    @Get("/ip_limit_test")
    @Limit(limitType.IP,2,10000) // 10秒内2次最大限制
    async IpLimitTest(req,res){
        return {
            code:0,
            message:"success"
        }
    }
}

export default UserController;