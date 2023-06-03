import { readdirSync } from "fs";
import express, { Express } from "express";
import { Application, ApplicationEvents } from "./index";
import { TarsusGlobalPipe } from "../pipe";
import { nextTick, cwd } from "process";
import path from "path";
import { TarsusOrm } from "../orm/TarsusOrm";
import { ServantUtil } from "../../util/servant";
import { TarsusCache } from "../../cache/TarsusCache";
import { TarsusOberserver } from "../ober/TarsusOberserver";
import { TarsusStreamProxy } from "../../microservice/application/TarsusStreamProxy";
import cluster from "cluster";
// import { cpus } from "os";

function loadController(args: Function[]) {
  args.forEach((el) => {
    console.log(el.name, " is  loader success");
  });

  ApplicationEvents.emit(Application.LOAD_SERVER);
}

/**
 * @description 加载服务的函数，开启NodeJS服务集群
 */
function loadServer(config?: {
  ms: boolean; // 是否启用微服务
}) {
  // 加载配置
  ApplicationEvents.emit(Application.LOAD_CONFIG, config);

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
  console.log("config--", config);

  nextTick(async () => {
    // 根据 tarsus.config 初始化信息
    let cache = new TarsusCache();
    // 得到 微服务
    await cache.getMsServer();

    const taro_path = config.servant.taro || "src/taro";
    const full_path = path.resolve(cwd(), taro_path);
    const dirs = readdirSync(full_path);
    dirs.forEach((interFace) => {
      let taro_path = path.resolve(full_path, interFace);
      // 将会存储到 TarsusStream 的 Map 里
      TarsusStreamProxy.SetStream(taro_path);
    });
  });
}

/**
 * @description 加载 http 服务的基础类
 */
const TarsusHttpApplication = (value: any, context: ClassDecoratorContext) => {
  context.addInitializer(() => {
    const app = TarsusOberserver.getApp();
    app.use(express.json());

    // 加载配置文件
    const config_path = path.resolve(cwd(), "tarsus.config.js");
    const _config = require(config_path);
    const SERVER = _config.servant.project;
    const parsedServers = SERVER.map((item) => {
      return ServantUtil.parse(item);
    });
    const ports = parsedServers.map((item) => {
      return item.port;
    });

    // 加载配置文件
    ApplicationEvents.on(Application.LOAD_CONFIG, function (props) {
      // 加载数据库
      ApplicationEvents.emit(Application.LOAD_DATABASE, _config);
      // 加载微服务
      if (props && props.ms) {
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
    app.use(TarsusOberserver.router);

    // 监听
    ApplicationEvents.on(Application.LOAD_LISTEN, () => {
      nextTick(() => {
        // 加载初始化方法
        ApplicationEvents.emit(Application.LOAD_INIT, app);
        // ******************************2023.6.3 开启集群******************************
        if (cluster.isWorker) {
          const __tarsus_port__ = process.env.__tarsus_port__;
          // console.log(`子进程环境变量`,process.env);
          const toMasterMessage = JSON.stringify({
            port: __tarsus_port__,
            pid: process.pid,
          });

          process.send(toMasterMessage);

          console.log(`子进程已开启 ----- PID ${process.pid}`);
          app.listen(__tarsus_port__, function () {
            console.log("Server started at port:", __tarsus_port__);
            // 监听
          });
        } else {
          console.log(`主进程已开启 ———— PID: ${process.pid}`);
          for (let i = 0; i < ports.length; i++) {
            const forker = cluster.fork({
              __tarsus_port__: ports[i],
            });

            forker.on("message", function (message) {
              if (typeof message == "string") {
                const data = JSON.parse(message as string);
                console.log(data);
              }
            });
            // 监听工作进程的退出事件
            forker.on("exit", (worker, code, signal) => {
              // console.log(`Worker process ${worker.process.pid} exited`);
              // @ts-ignore
              console.log(`Starting a new worker...`);
              cluster.fork({
                __tarsus_port__: ports[i],
              });
            });
          }
        }
      });
    });
  });
};

export { TarsusHttpApplication, loadController, loadServer, loadInit };
