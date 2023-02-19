import { Inject } from "../../../decorator/ioc"
import { ArcInterFace, ArcMethod } from "../../../decorator/microservice/application"
import { DemoService } from "../service/demo.service"

@ArcInterFace("DemoInterFace")
class Demo{

    @Inject(DemoService) DemoService:DemoService

    @ArcMethod
    say(){
        console.log(this.DemoService.TestDemo());
        console.log(this.hello);
        return '112233'
    }

    @ArcMethod
    hello(){

    }
}

export {
    Demo
}