import { DataTransferOBJ, IsNumber, IsString, MinLen, MaxLen } from "../../../../lib/decorator/interceptor/Validate";

@DataTransferOBJ()
class UserValidateObj{
    @IsNumber()
    age:number;

    @IsString()
    @MinLen(1)
    @MaxLen(10)
    name:string;
}

export default UserValidateObj