import { ArcServerApplication } from "../../decorator/microservice/application"
import { loadInterFace, loadMicroService } from "../../decorator/microservice/load"
import { Demo } from "./register/demo"
import { Hello } from "./register/hello"


@ArcServerApplication(10012,"127.0.0.1")
class ArcServerTest{
    static main(){
        loadInterFace([Hello,Demo])
        loadMicroService()
    }
}

ArcServerTest.main()