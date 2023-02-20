import { Inject } from "../../../decorator/ioc";
import { Controller } from "../../../decorator/web/controller";
import { Get } from "../../../decorator/web/method";
import { View } from "../../../decorator/web/view";
import { AppService } from "../service/app.service";
@Controller("/hello")
class appController {

  @Inject(AppService) AppService: AppService;

  @Get("/say")
  public say() {}

  @View("/body")
  public body(){
    return {
      template:`
        {{ extend resolve('hello/layout.art') }}
        {{block 'content'}}
            <div>{{Test}}</div>
            <div>{{222222222222}}</div>
        {{/block}}
      `,
      data:{
        Test:"111"
      }
    }
  }
}

export {
  appController
}
