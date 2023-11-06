import { DataTransferOBJ,IsNumber,IsString,MaxDate,MaxLen, MinLen, TarsusValidate } from "./Validate";

@DataTransferOBJ()
class TestValidateObj{
    @IsNumber()
    age:number;

    @IsString()
    @MinLen(1)
    @MaxLen(10)
    name:string;
}
const obj = new TestValidateObj()
obj.name = '123465';
obj.age = 10

const validadte = TarsusValidate(obj)
console.log(validadte);



