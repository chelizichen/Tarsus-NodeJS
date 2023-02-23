import { Inject } from "../../../decorator/ioc/index";
import { Controller } from "../../../decorator/web/controller/index";
import { Get } from "../../../decorator/web/method/index";
import { AppService } from "../service/app.service";

@Controller("/hello")
class appController {
  @Inject(AppService) AppService: AppService;

  public age;
  public name;

  init() {
    this.add = this.add.bind(this);
    this.age = 21;
    this.name = "LeeSeriousYun";
  }

  add() {
    this.age++;
  }

  @Get("/say")
  public say() {
    this.age++;
    return "say hello";
  }
  @Get("/say")
  public Body() {
    this.add();
    return `
        <div>hello world ${this.age}</div>
      `;
  }
}

export {
  appController
}
