import {Controller, Get} from "../../../decorator/http/router";
import Ret from '../utils/ret'
@Controller("/user")
class UserController {

    @Get("/list")
    getUserList(req, res) {
        return Ret.success("hello world")
    }
}

export default UserController;