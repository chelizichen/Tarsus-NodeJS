import { TarsusInterFace, TarsusMethod } from "../../../decorator/microservice/interface/TarsusInterFace";

@TarsusInterFace("HelloInterFace")
class Hello{

    @TarsusMethod
    say(){

    }
}

export {
    Hello
}