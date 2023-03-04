import { Inject } from "../../../decorator/ioc"
import { TarsusInterFace, TarsusMethod } from "../../../decorator/microservice/interface/TarsusInterFace";
import { Song } from "../entity/song";
import { DemoService } from "../service/demo.service"

@TarsusInterFace("DemoInterFace")
class Demo{

    @Inject(DemoService) DemoService:DemoService

    @TarsusMethod
    say() {
        // 将 arguments 转为对象的形式
        console.log(arguments.length);
        
        let name = arguments[0];
        let age = arguments[1];
        console.log(name);
        console.log(age);
        
        
        // let value = new Song(arguments[2]).logDetail();
        return {
            name,age
        };
    }

    @TarsusMethod
    hello(){
        let name = arguments[0];
        let age = arguments[1];
        console.log(name);
        console.log(age);
        return {
            name,age
        };
    }
}

export {
    Demo
}