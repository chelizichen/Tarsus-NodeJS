import { Inject } from "../../../decorator/ioc/index";
import { Controller } from "../../../decorator/web/controller/index";
import { Get } from "../../../decorator/web/method/index";
import { View } from "../../../decorator/web/view/index";
import { AppService } from "../service/app.service";
import { Layout } from "../views/Layout";
import React from 'react'

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
    this.age++
    return "say hello"
  }

  @View("/body")
  public Body() {
    this.add()
    return (
      <Layout>
        <button onClick={this.add}>点击按钮</button>
        <div>{ this.name }</div>
        <div>{ this.age }</div>
      </Layout>
    );
  }

}

export {
  appController
}
