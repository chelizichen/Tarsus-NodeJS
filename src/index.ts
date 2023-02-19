import { appController } from "./controller/app.controller";
import { demoController } from "./controller/demo.controller";
import {  ArcServer } from '../decorator/web/application';
import { loadController } from "../decorator/web/application/ArcServer";
import { loadGlobalPipe } from "../decorator/web/pipe";
import { LogGlobalPipe } from "./pipe/Log";

@ArcServer(9811)
class TestApplication{
  static main () :void {
    loadController([appController,demoController]);
    loadGlobalPipe([LogGlobalPipe])
  }
}

TestApplication.main()


