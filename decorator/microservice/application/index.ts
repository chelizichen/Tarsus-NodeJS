import { readdirSync } from 'fs';
import { cwd } from "process";
import { TarsusServer } from "./TarsusServer";
import { Application, ApplicationEvents } from "../load";
import path from "path";
import { ServantUtil } from "../../util/servant";
import { interFaceMap } from "../interface/TarsusInterFace";
import { TarsusCache } from '../../cache/TarsusCache';

const TarsusMsApplication = (value, context) => {
  context.addInitializer(() => {
    const config_path = path.resolve(cwd(), "tarsus.config.js");
    const _config = require(config_path);
    const SERVER = _config.servant.project;
    const parsedServer = ServantUtil.parse(SERVER);
    const port = parsedServer.port || 8080;
    const host = parsedServer.host;

    console.log("parsedServer", parsedServer);

    ApplicationEvents.on(Application.LOAD_INTERFACE, function (args: any[]) {
      args.forEach((el) => {
        console.log(el.name, "is load");
      });
    });

    ApplicationEvents.on(Application.REQUIRE_INTERFACE, function () {
      // 后续做处理
      const register_path = _config.servant.src || "src/register";
      const full_path = path.resolve(cwd(), register_path);
      const dirs = readdirSync(full_path)
      dirs.forEach(interFace=>{
        let interFace_path = path.resolve(full_path,interFace)
        // 动态加载每一个注册的接口
        require(interFace_path)
      })
    });

    ApplicationEvents.on(Application.LOAD_MICROSERVICE, function () {
      const cache = new TarsusCache()
      cache.setServant()

      let arc_server = new TarsusServer({ port: Number(port), host });
      arc_server.registEvents(interFaceMap);
      console.log(arc_server.ArcEvent.events);
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
