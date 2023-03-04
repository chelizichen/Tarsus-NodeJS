import express, { Express } from "express";
import { controllers } from "../controller/routers";
import { Application, ApplicationEvents } from "./index";
import { TarsusGlobalPipe } from "../pipe";
import { nextTick, cwd } from "process";
import path from "path";
import { TarsusOrm } from "../orm/TarsusOrm";
import cluster from 'cluster';
import {cpus}  from 'os'

function loadController(args: Function[]) {
  args.forEach((el) => {
    console.log(el.name, " is  loader success");
  });

  ApplicationEvents.emit(Application.LOAD_SERVER);
}

function loadServer(config?:{
  cluster:boolean
}) {
  // 加载配置
  ApplicationEvents.emit(Application.LOAD_CONFIG);

  // 最后监听
  ApplicationEvents.emit(Application.LOAD_LISTEN,config);
}

function loadInit(callback: (app: Express) => void) {
  ApplicationEvents.on(Application.LOAD_INIT, (app) => {
    callback(app);
  });
}

const TarsusHttpApplication = (value: any, context: ClassDecoratorContext) => {
  let port = 9811;
  context.addInitializer(() => {
    const app = express();
    app.use(express.json());

    // 执行初始化逻辑

    // 加载配置文件
    ApplicationEvents.on(Application.LOAD_CONFIG, function () {
      const config_path = path.resolve(cwd(), "tarsus.config.js");
      const _config = require(config_path);
      port = _config.servant.port;
      ApplicationEvents.emit(Application.LOAD_DATABASE, _config);
    });

    // 加载数据库
    ApplicationEvents.on(Application.LOAD_DATABASE, TarsusOrm.CreatePool);
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
          ApplicationEvents.on(Application.LOAD_LISTEN, (config?: {
            cluster: boolean
          }) => {
            nextTick(() => {
              ApplicationEvents.emit(Application.LOAD_INIT, app);

              // 开启多进程程
              if (config && config.cluster) {

                // 为主进程
                if (cluster.isPrimary) {
                  let workers: Record<any, any> = {};
                  console.log(`Master ${process.pid} is running`);
              
                  for (let i = 0; i < cpus().length; i++) {
                    let worker = cluster.fork();
    
                    workers[worker.process.pid] = worker;
                    console.log(`Child Process ${worker.process.pid} is running`);
                
                  }

                  cluster.on("exit", (worker, _code, _signal) => {
                    console.log(`工作进程 ${worker.process.pid} 已退出`);
                    delete workers[worker.process.pid];
                    worker = cluster.fork();
                    workers[worker.process.pid] = worker;
                  });
                } else {
                  app.listen(port, function () {
                    console.log("Server started at port: ", port);
                  });
                }
              } else {
                app.listen(port, function () {
                  console.log("Server started at port: ", port);
                });
              }
            });
          });
        });
      });
    })
  })
};

export { TarsusHttpApplication, loadController, loadServer, loadInit };
