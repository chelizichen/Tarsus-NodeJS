import { Request } from "express";
import { Controller, Get, Post } from "../../../../lib/decorator/http/router";
import { UsePipe } from "../../../../lib/decorator/http/pipe";
import { TestValidatePipe } from "../pipe/ValidatePipe";
import { HttpCode } from "../../../../lib/httpservice";

@Controller("validate")
class ValidateController {
    @Get("list")
    @UsePipe(new TestValidatePipe())
    getList(req:Request){
        const body = req.body;
        return {iData:body};
    }

    @Post('/status')
    @UsePipe(new TestValidatePipe())
    @HttpCode(404)
    async changeStatus(){
        return {
            code:1
        }
    }
}


export default ValidateController