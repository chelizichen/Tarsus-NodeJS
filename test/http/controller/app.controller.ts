import { Inject } from "../../../decorator/ioc";
import { Controller } from "../../../decorator/web/controller";
import { Get } from "../../../decorator/web/method";
import { AppService } from "../service/app.service";

@Controller("/hello")
class appController {

  @Inject(AppService) AppService: AppService;

  @Get("/say")
  public say() {}
}

export {
  appController
}
