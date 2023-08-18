import {Controller, Get, INVOKE} from "../../../../lib/decorator/http/router";
import Ret from '../utils/ret'
import load_proto from "../../../../lib/main_control/proto_base";
@Controller("/user")
class UserController {

    @Get("/list")
    getUserList(req) {
        return Ret.success("hello world")
    }

    @INVOKE("/invoke")
    invoke(req,res){
        debugger;
        load_proto.transmit(req,res);
    }
}

export default UserController;