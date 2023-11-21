import { Request } from "express";
import { Controller, Get, Post } from "../../../../lib/decorator/http/router";
import { UsePipe } from "../../../../lib/decorator/http/pipe";
import { TestValidatePipe, TestOtherValidatePipe } from "../pipe/ValidatePipe";
import { HttpCode } from "../../../../lib/httpservice";
import { JwtValidate } from '../../../../lib/decorator/interceptor/Jwt'
import { TokenValidate } from "../jwt/validate";

@Controller("validate")
@JwtValidate(new TokenValidate())
class ValidateController {

    @Get("list")
    @UsePipe(new TestValidatePipe())
    getList(req:Request){
        const body = req.body;
        body.ip = '12011'
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

    @Post('/test')
    @UsePipe(new TestOtherValidatePipe())
    async test(){
        return {
            code:1
        }
    }
}


export default ValidateController