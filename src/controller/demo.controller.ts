import { UseInterCeptor } from "../../decorator/web/aop";
import { Inject } from "../../decorator/ioc";
import { Controller } from "../../decorator/web/controller";
import { Get } from "../../decorator/web/method";
import { LogInterCeptor } from "../interceptor/log";
import { AppService } from "../service/app.service";
import { TestService } from "../service/test.service";
import { Request, Response } from "express";
import { query } from "../../decorator/web/params/type";
import { Goods } from "../entity/goods.entity";

@Controller("/demo")
class demoController {

  @Inject(AppService) AppService: AppService;

  @Inject(TestService) TestService: TestService;

  @Get("/test") @UseInterCeptor(new LogInterCeptor())
  public async test(req: query<Goods>) {
    const {id,sort_type_id} = req.query;
    const ret = await this.TestService.hello(id,sort_type_id)
    // console.log('this',this);
    
    return { ret };
  }

  @Get("/say")
  public say(req:Request) {
    return {
      
    }
  }
}

export { demoController };
