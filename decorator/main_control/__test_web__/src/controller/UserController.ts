import {Controller, Get} from "../../../decorator/http/router";

@Controller("/user")
class UserController {

    @Get("/list")
    async getUserList(req, res) {
        return Ret.success("hello world")
    }
}

export default UserController;