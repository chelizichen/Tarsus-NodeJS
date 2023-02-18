import { appController } from "./controller/app.controller";
import { demoController } from "./controller/demo.controller";
import {  ArcServer } from '../decorator/web/application';
import { loaderClass } from "../decorator/web/application/ArcServer";

@ArcServer(9811)
class TestApplication{
  static main () :void {
    loaderClass([appController,demoController]);
  }
}

TestApplication.main()


