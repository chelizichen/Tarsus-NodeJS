import { Inject } from "../../../decorator/ioc";
import { proxyService } from "../../../decorator/microservice/service/proxyService";
import { Controller } from "../../../decorator/web/controller";
import { Post } from "../../../decorator/web/method";
import { body } from "../../../decorator/web/params/type";
import { AppService } from "../service/app.service";

@Controller("/proxy")
class proxyController {
  @Inject(AppService) AppService: AppService;

  @Post("/interceptor")
  async interceptor(
    req: body<{
      interFace: string;
      method: string;
      data: any;
      timeout: string;
      key: string;
    }>
  ) {
    const { body } = req as any;
    body.data["EndData"] = "End";
    console.log("body", req.query);
    
    let data = (await proxyService.transmit(body)) as Buffer;
    let _tostr_ = data.toString();
    return {
      msg: "ProxySide",
      code: 0,
      data: _tostr_,
    };
  }
}

export { proxyController };
