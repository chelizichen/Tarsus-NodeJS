import { proxyService } from "../../decorator/microservice/service/proxyService";
import { ArcHttpApplication } from "../../decorator/web/application";
import { loadController, loadServer } from "../../decorator/web/application/ArcServer";
import { loadGlobalPipe } from "../../decorator/web/pipe";
import { appController } from "./controller/app.controller";
import { demoController } from "./controller/demo.controller";
import { proxyController } from "./controller/proxy.controller";

import { LogGlobalPipe } from "./pipe/Log";

@ArcHttpApplication(7099)
class TestApplication {
  static main(): void {
    loadController([appController, demoController,proxyController]);
    loadGlobalPipe([LogGlobalPipe]);
    proxyService.boost()
    loadServer();
  }
}

TestApplication.main()


