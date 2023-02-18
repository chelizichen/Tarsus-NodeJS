import { appController } from "./controller/app.controller";
import { demoController } from "./controller/demo.controller";
import {  ArcServer } from '../decorator/web/application';

@ArcServer(9811)
class TestApplication{
  static main () :void {
    new appController();
    new demoController();
  }
}

TestApplication.main()


