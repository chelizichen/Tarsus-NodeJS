import { ArcInterFace, ArcMethod } from "../../../decorator/microservice/application"

@ArcInterFace("HelloInterFace")
class Hello{

    @ArcMethod
    say(){

    }
}

export {
    Hello
}