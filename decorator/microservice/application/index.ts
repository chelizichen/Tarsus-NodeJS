import { readdirSync } from 'fs';
import { cwd } from "process";
import { TarsusServer } from "./TarsusServer";
import { Application, ApplicationEvents } from "../load";
import path from "path";
import { ServantUtil } from "../../util/servant";
import { TarsusCache } from '../../cache/TarsusCache';
import { interFaceMaps } from '../interface/TarsusInterFace';
import { TarsusStreamProxy } from './TarsusStreamProxy';
import cluster from 'cluster';

/**
 * @description 启动微服务
 */
const TarsusMsApplication = (value, context) => {
  context.addInitializer(() => {
    // 拿到config 的配置文件
    const config_path = path.resolve(cwd(), "tarsus.config.js");
    const _config = require(config_path);
    
    // 拿到集群的数组对象
    const SERVER = _config.servant.project;
    const parsedServer = SERVER.map(item=>{
      return ServantUtil.parse(item)}
    ) as any[]
    // const port = parsedServer.port;
    // const host = parsedServer.host;

    ApplicationEvents.on(Application.LOAD_INTERFACE, function (args: any[]) {
      args.forEach((el) => {
        console.log(el.name, "is load");
      });
    });

    ApplicationEvents.on(Application.REQUIRE_INTERFACE, function () {
      // 后续做处理
      const register_path = _config.servant.register || "src/register";
      const full_path = path.resolve(cwd(), register_path);
      const dirs = readdirSync(full_path)
      dirs.forEach(interFace => {
        let interFace_path = path.resolve(full_path, interFace)
        const singalClazz = require(interFace_path).default
        new singalClazz()
      })
    });

    ApplicationEvents.on(Application.LOAD_TARO, function () {
      const taro_path = _config.servant.taro || "src/taro";
      const full_path = path.resolve(cwd(), taro_path);
      const dirs = readdirSync(full_path);
      dirs.forEach((interFace) => {
        let taro_path = path.resolve(full_path, interFace);
        // 将会存储到 TarsusStream 的 Map 里
        TarsusStreamProxy.SetStream(taro_path);
      });
    });

    ApplicationEvents.on(Application.LOAD_STRUCT, function () {
      // 后续做处理
      const struct_path = _config.servant.struct || "src/struct";
      const full_path = path.resolve(cwd(), struct_path);
      const dirs = readdirSync(full_path);
      dirs.forEach((interFace) => {
        let interFace_path = path.resolve(full_path, interFace);
        const singalClazz = require(interFace_path);
        
        for (let v in singalClazz) {
          TarsusStreamProxy.TarsusStream.define_struct(singalClazz[v])
        }
      });
    });

    // 加载方法
    // 5.31 更新 添加多进程模型
    ApplicationEvents.on(Application.LOAD_MICROSERVICE, function () {

      ApplicationEvents.emit(Application.LOAD_TARO)
      ApplicationEvents.emit(Application.LOAD_STRUCT);


      const cache = new TarsusCache()
      cache.setServant()
      console.log("cluster is isWorker",cluster.isWorker);
      
      if(!cluster.isWorker){
        console.log(`主进程已开启 ———— PID: ${process.pid}`);
        for (let i = 0; i < parsedServer.length; i++) {
          cluster.fork();
        }
         // 监听工作进程的退出事件
        cluster.on('exit', (worker, code, signal) => {
          console.log(`Worker process ${worker.process.pid} exited`);
          console.log(`Starting a new worker...`);
          cluster.fork();
        });
      }else{
        console.log("开启子进程 ————PID",process.pid);
        parsedServer.forEach(item=>{
          let arc_server = new TarsusServer({ port: Number(item.port), host:item.host });
          arc_server.registEvents(interFaceMaps);
          console.log(arc_server.TarsusEvent.events);
        })
      }
      // TEST FUNCTION

      // setTimeout(async ()=>{
      //     const {from} = Buffer
      //     const data = await arc_server.ArcEvent.emit(from('[#1]DemoInterFace[#2]say'))
      //     console.log(data);
      // })
    });
  });
};

export { TarsusMsApplication, TarsusServer };
