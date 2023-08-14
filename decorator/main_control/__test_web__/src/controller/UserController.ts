import {Controller, Get} from "../../../decorator/http/router";
import Ret from '../utils/ret'
@Controller("/user")
class UserController {

    @Get("/list")
    getUserList(req) {
        return Ret.success("hello world")
    }
}

export default UserController;