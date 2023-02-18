import { Inject } from "../../decorator/ioc";
import { Controller } from "../../decorator/web/controller";
import { Get } from "../../decorator/web/method";
import { AppService } from "../service/app.service";
import { TestService } from "../service/test.service";

@Controller("/hello")
class appController {
  constructor() {
    console.log(1);
  }

  @Inject(AppService)
  AppService!: AppService;

  @Inject(TestService)
  TestService!: TestService;

  @Get("/say")
  public say() {}
}

export {
  appController
}
