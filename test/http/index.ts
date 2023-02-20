import { cwd } from 'process';
import { proxyService } from "../../decorator/microservice/service/proxyService";
import { ArcHttpApplication } from "../../decorator/web/application";
import { loadController, loadInit, loadServer } from "../../decorator/web/application/ArcServer";
import { loadGlobalPipe } from "../../decorator/web/pipe";
import { appController } from "./controller/app.controller";
import { demoController } from "./controller/demo.controller";
import { proxyController } from "./controller/proxy.controller";
import { LogGlobalPipe } from "./pipe/Log";
import template from 'art-template'
import path from 'path'
import express from 'express';
import { resolveViews } from './utils/render';


@ArcHttpApplication(7099)
class TestApplication {
  static main(): void {

    loadController([appController, demoController,proxyController]);
    loadGlobalPipe([LogGlobalPipe]);
    loadInit((app)=>{
      const public_path = path.resolve(cwd(),"public")
      app.use(express.static(public_path));
      const view_path = path.join(cwd(),"public",'views')
      template.defaults.imports.resolve = resolveViews;
      app.set('views',view_path); // general config
      app.set('view engine', 'art');
      app.engine('art',template);
    })
    proxyService.boost()
    loadServer();
  }
}

TestApplication.main()


