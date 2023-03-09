import express, { Express } from "express";
import { controllers } from "../controller/routers";
import { Application, ApplicationEvents } from "./index";
import { TarsusGlobalPipe } from "../pipe";
import { nextTick, cwd } from "process";
import path from "path";
import { TarsusOrm } from "../orm/TarsusOrm";
import { ServantUtil, parseToObj } from "../../util/servant";
import { TarsusProxy } from "../proxy";
import { TarsusProxyService } from "../service/TarsusProxyService";
import { TarsusCache } from "../../cache/TarsusCache";
// import cluster from "cluster";
// import { cpus } from "os";

function loadController(args: Function[]) {
  args.forEach((el) => {
    console.log(el.name, " is  loader success");
  });

  ApplicationEvents.emit(Application.LOAD_SERVER);
}

function loadServer(config?:{
  ms:boolean // 是否启用微服务
}) {
  // 加载配置
  ApplicationEvents.emit(Application.LOAD_CONFIG,config);

  // 最后监听
  ApplicationEvents.emit(Application.LOAD_LISTEN);
}

// 初始化
function loadInit(callback: (app: Express) => void) {
  ApplicationEvents.on(Application.LOAD_INIT, (app) => {
    callback(app);
  });
}

function loadMs() {
  nextTick(async () => {
    // 创建后台微服务 Map
    TarsusProxyService.MicroServices = new Map<string, TarsusProxy>();
    // 根据 tarsus.config 初始化信息 
    let cache = new TarsusCache()
    // 得到 微服务
    await cache.getMsServer()
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
    ApplicationEvents.on(Application.LOAD_CONFIG, function (props) {
      // 加载数据库
      ApplicationEvents.emit(Application.LOAD_DATABASE, _config);
      // 加载微服务
      if(props && props.ms){
        ApplicationEvents.emit(Application.LOAD_MS, _config);
      }
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
        // 加载初始化方法
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
