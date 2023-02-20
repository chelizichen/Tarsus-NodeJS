import { Inject } from "../../../decorator/ioc"
import { ArcInterFace, ArcMethod } from "../../../decorator/microservice/application"
import { DemoService } from "../service/demo.service"

@ArcInterFace("DemoInterFace")
class Demo{

    @Inject(DemoService) DemoService:DemoService

    @ArcMethod
    say() {
        // 将 arguments 转为对象的形式
        console.log(arguments.length);
        return arguments;
    }

    @ArcMethod
    hello(){

    }
}

export {
    Demo
}