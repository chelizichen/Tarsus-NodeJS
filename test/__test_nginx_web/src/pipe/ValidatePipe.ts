import { Request } from 'express';
import {TarsusPipe} from '../../../../lib/decorator/http/pipe';
import {TarsusValidate, plainToInstance} from '../../../../lib/decorator/interceptor/Validate';
import UserValidateObj from '../dto/User';
import { PipeError } from '../../../../lib/decorator/http/error';

class TestValidatePipe implements TarsusPipe{
    handle(req:Request){
        req.body = plainToInstance(req.body,UserValidateObj)
        const check = TarsusValidate(req.body)
        console.log('check',check);
        if(!check){
            throw PipeError();
        }
    }
}


export {
    TestValidatePipe
}