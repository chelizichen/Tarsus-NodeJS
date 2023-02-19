import { UseInterCeptor } from "../../decorator/web/aop";
import { Inject } from "../../decorator/ioc";
import { Controller } from "../../decorator/web/controller";
import { Get } from "../../decorator/web/method";
import { LogInterCeptor } from "../interceptor/log";
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
  @UseInterCeptor(new LogInterCeptor())
  public test(req: Request) {
    const data = req.query;
    const ret = this.TestService.hello()
    // console.log('this',this);
    
    return { data, ret };
  }

  @Get("/say")
  public say(req:Request) {
    return {
      
    }
  }
}

export { demoController };
