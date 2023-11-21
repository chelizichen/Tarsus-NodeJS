import { Request } from 'express';
import { TokenError } from '../../../../lib/decorator/http/error'
import { TarsusJwtValidate} from '../../../../lib/decorator/interceptor/Jwt'

class TokenValidate implements TarsusJwtValidate{
    async handle(req:Request){
        console.log(req.headers.token);
        if(!req.headers.token){
            throw TokenError("没token")
        }
    }
}

export {
    TokenValidate
}