import { Inject } from "../../../decorator/ioc/index";
import { Controller } from "../../../decorator/web/controller/index";
import { Get } from "../../../decorator/web/method/index";
import { AppService } from "../service/app.service";
import { ret } from '../../../../Tarsus-GateWay/src/utils/ret';

@Controller("hello")
class appController {
  @Inject(AppService) AppService: AppService;

  @Get("say")
  public say() {
    console.log("app",this);
    const data = this.AppService.hello()
    return ret.success(data)
  }
}

export {
  appController
}
