import express, { Express } from "express";
import { controllers } from "../controller/routers";
import { Application, ApplicationEvents } from "./index";
import { ArcGlobalPipe } from "../pipe";
import { nextTick, cwd } from "process";
import path from "path";
import { ArcOrm } from "../orm/ArcOrm";

function loadController(args: Function[]) {
  args.forEach((el) => {
    console.log(el.name, " is  loader success");
  });

  ApplicationEvents.emit(Application.LOAD_SERVER);
}

function loadServer() {
  // 加载配置
  ApplicationEvents.emit(Application.LOAD_CONFIG);

  // 最后监听
  ApplicationEvents.emit(Application.LOAD_LISTEN);
}

const ArcHttpApplication = (port: number) => {
  return function (value: any, context: ClassDecoratorContext) {
    context.addInitializer(() => {
      const app = express();
      app.use(express.json())

      // 加载配置文件
      ApplicationEvents.on(Application.LOAD_CONFIG, function () {
        const config_path = path.resolve(cwd(), "arc.config.js");
        const _config = require(config_path);
        ApplicationEvents.emit(Application.LOAD_DATABASE, _config);
      });

      // 加载数据库
      ApplicationEvents.on(Application.LOAD_DATABASE, ArcOrm.CreatePool);
      // 全局管道
      ApplicationEvents.on(
        Application.LOAD_PIPE,
        function (args: Array<new () => ArcGlobalPipe>) {
          args.forEach((pipe) => {
            let _pipe = new pipe();
            app.use("*", (req, res, next) => _pipe.next(req, res, next));
          });
        }
      );

      // 加载路由
      ApplicationEvents.on(Application.LOAD_SERVER, () => {
        controllers.forEach((value: any) => {
          app.use(value);
        });
      });

      // 监听
      ApplicationEvents.on(Application.LOAD_LISTEN, () => {
        nextTick(() => {
          app.listen(port, function () {
            console.log("Server started at port: ", port);
          });
        });
      });
    });
  };
};

export { ArcHttpApplication, loadController, loadServer };
