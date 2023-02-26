import {cwd} from 'process';
import { proxyService } from "../../decorator/microservice/service/proxyService";
import { TarsusHttpApplication } from "../../decorator/web/application/index";
import { loadController, loadInit, loadServer } from "../../decorator/web/application/TarsusServer";
import { loadGlobalPipe } from "../../decorator/web/pipe/index";
import { appController } from "./controller/app.controller";
import { demoController } from "./controller/demo.controller";
import { proxyController } from "./controller/proxy.controller";
import { LogGlobalPipe } from "./pipe/Log";
import path from 'path'
import express from 'express';


@TarsusHttpApplication(7099)
class TestApplication {
  static main(): void {
    loadController([appController, demoController, proxyController]);
    loadGlobalPipe([LogGlobalPipe]);
    loadInit((app) => {
      const public_path = path.resolve(cwd(), "public");
      app.use(express.static(public_path));
      // proxyService.boost()
    });
    loadServer({
      cluster:true
    });
  }
}

TestApplication.main()