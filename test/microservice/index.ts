import { TarsusMsApplication } from "../../decorator/microservice/application/index";
import { loadInterFace, loadMicroService } from "../../decorator/microservice/load/index"
import { Demo } from "./register/demo"
import { Hello } from "./register/hello"


@TarsusMsApplication
class ArcServerTest {
  static main() {
    require("./test/require")
    loadInterFace([Hello, Demo]);
    loadMicroService();
  }
}

ArcServerTest.main()