import { Inject } from "../../decorator/ioc";
import { Controller } from "../../decorator/web/controller";
import { Get } from "../../decorator/web/method";
import { AppService } from "../service/app.service";
import { TestService } from "../service/test.service";
import { Request, Response } from "express";

@Controller("/demo")
class demoController {
  @Inject(AppService)
  AppService!: AppService;

  @Inject(TestService)
  TestService!: TestService;

  @Get("/test")
  public test(req: Request) {
    const data = req.query;
    const ret = this.TestService.hello();

    return { data, ret };
  }

  @Get("/say")
  public say() {}
}

export { demoController };
