import { Inject } from "../../../decorator/ioc";
import { UseInterCeptor } from "../../../decorator/web/aop";
import { Controller } from "../../../decorator/web/controller";
import { Get, Post } from "../../../decorator/web/method";
import { query } from "../../../decorator/web/params/type";
import { FundList } from "../entity/goods.entity";
import { LogInterCeptor } from "../interceptor/log";
import { AppService } from "../service/app.service";


@Controller("/demo")
class demoController {
  @Inject(AppService) AppService: AppService;

  @Get("/test")
  @UseInterCeptor(new LogInterCeptor())
  public async test(req: query<FundList>) {
    // const { id = "1" } = req.query;
    const ret = await this.AppService.hello();
    return { ret };
  }

  @Post("/say")
  public say(req: Request) {
    return {
      body: req.body,
    };
  }
}

export { demoController };
