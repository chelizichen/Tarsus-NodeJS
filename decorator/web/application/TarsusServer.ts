import express, { Express } from "express";
import { controllers } from "../controller/routers";
import { Application, ApplicationEvents } from "./index";
import { TarsusGlobalPipe } from "../pipe";
import { nextTick, cwd } from "process";
import path from "path";
import { TarsusOrm } from "../orm/TarsusOrm";
import { ServantUtil, parseToObj } from "../../util/servant";
import { TarsusProxy } from "../proxy";
import { proxyService } from "../../microservice/service/proxyService";
// import cluster from "cluster";
// import { cpus } from "os";

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

// 初始化
function loadInit(callback: (app: Express) => void) {
  ApplicationEvents.on(Application.LOAD_INIT, (app) => {
    callback(app);
  });
}

function loadMs(config) {
  nextTick(() => {
    proxyService.MicroServices = new Map<string, TarsusProxy>();
    config.servant.includes.forEach((servant: string) => {
      let parsedServant: parseToObj = ServantUtil.parse(servant);
      console.log(parsedServant);
      let proxy_instance = new TarsusProxy(
        parsedServant.host,
        Number(parsedServant.port)
      );

      parsedServant.language == "java" ? (proxy_instance.java = true) : "";

      const { key } = proxy_instance;
      proxyService.MicroServices.set(key, proxy_instance);
    });
  });
}

const TarsusHttpApplication = (value: any, context: ClassDecoratorContext) => {
  context.addInitializer(() => {
    const app = express();
    app.use(express.json());

    // 加载配置文件
    const config_path = path.resolve(cwd(), "tarsus.config.js");
    const _config = require(config_path);
    const SERVER = _config.servant.project;
    const parsedServer = ServantUtil.parse(SERVER);
    const port = parsedServer.port || 8080;

    // 加载配置文件
    ApplicationEvents.on(Application.LOAD_CONFIG, function () {
      // 加载数据库
      ApplicationEvents.emit(Application.LOAD_DATABASE, _config);
      // 加载微服务
      // ApplicationEvents.emit(Application.LOAD_MS, _config);
    });

    // 加载数据库
    ApplicationEvents.on(Application.LOAD_DATABASE, TarsusOrm.CreatePool);

    ApplicationEvents.on(Application.LOAD_MS, loadMs);
    // 全局管道
    ApplicationEvents.on(
      Application.LOAD_PIPE,
      function (args: Array<new () => TarsusGlobalPipe>) {
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
        ApplicationEvents.emit(Application.LOAD_INIT, app);
        app.listen(port, function () {
          console.log("Server started at port: ", port);
          // 监听
        });
      });
    });
  });
};

export { TarsusHttpApplication, loadController, loadServer, loadInit };
