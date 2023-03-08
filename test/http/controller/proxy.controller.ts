import { Inject } from "../../../decorator/ioc/index";
import { TarsusProxyService } from "../../../decorator/web/service/TarsusProxyService";
import { Controller } from "../../../decorator/web/controller/index";
import { Proxy } from "../../../decorator/web/method/index";
import { proxy } from "../../../decorator/web/method/types";
import { body } from "../../../decorator/web/params/type";
import { AppService } from "../service/app.service";
import { Response } from "express";
@Controller("/proxy")
class proxyController {
  @Inject(AppService) AppService: AppService;

  @Proxy("/interceptor")
  async interceptor(req: body<proxy>, res: Response) {
    console.log('req.query',req.query);
    console.log("req.body",req.body);
    
    
    const { body } = req as any;
    TarsusProxyService.transmit(body, res)
    
    // then((data) => {
    //   let Arc_ProxyInstance = proxyService.MicroServices.get(req.body.key);
    //   Arc_ProxyInstance.TarsusEvents.on
    //   let _tostr_ = data;
    //   res.json({
    //     msg: "ProxySide",
    //     code: 0,
    //     data: _tostr_,
    //   });
    // });
  }
}

export { proxyController };
