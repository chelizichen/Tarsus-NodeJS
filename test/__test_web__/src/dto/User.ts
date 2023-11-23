import {  IsNumber, IsString, MinLen, MaxLen, Required, CheckStatus, TarsusDTO } from "../../../../lib/decorator/interceptor/Validate";

@TarsusDTO()
class UserValidateObj{
    @IsNumber()
    age:number;

    @IsString()
    @MinLen(1)
    @MaxLen(10)
    name:string;

    @Required()
    email:string;

    @CheckStatus([1,2,3,4])
    status:number;
}

export default UserValidateObj