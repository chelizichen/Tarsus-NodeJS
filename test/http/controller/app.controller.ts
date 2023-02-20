import { EventEmitter } from 'node:events';
import { Inject } from "../../../decorator/ioc";
import { Controller } from "../../../decorator/web/controller";
import { Get } from "../../../decorator/web/method";
import { View } from "../../../decorator/web/view";
import { AppService } from "../service/app.service";

@Controller("/hello")
class appController {
  public age;

  init(){
    this.add = this.add.bind(this)
    this.age = 0
  }
  add(){
    this.age++
  }

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
            <div>{{$data}}</div>
            <button onclick='console.log(111,{{inst}})'>click</button>
            <button onclick='{{$data.add}}'>测试增加</button>
        {{/block}}
      `,
      data:{
        age:this.age,
        inst:this,
        add:()=>this.add
      }
    }
  }
}

export {
  appController
}
