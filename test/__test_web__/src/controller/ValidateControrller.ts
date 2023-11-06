import { Request } from "express";
import { Controller, Post } from "../../../../lib/decorator/http/router";
import { UsePipe } from "../../../../lib/decorator/http/pipe";
import { TestValidatePipe } from "../pipe/ValidatePipe";

@Controller("validate")
class ValidateController {
    @Post("list")
    @UsePipe(new TestValidatePipe())
    getList(req:Request){
        const body = req.body;
        return body;
    }
}


export default ValidateController