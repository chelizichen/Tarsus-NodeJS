import { readFileSync } from "fs";
import path from "path";
import { nextTick } from "node:process";
import { call } from "../utils/call";
import { TarsusProxy } from "../../web/proxy";
import { Response } from "express";

export class proxyService {
  static transmit(body: any,res:Response) {
    const { key } = body;
    let ProxyInstance = proxyService.MicroServices.get(key);
    if (ProxyInstance) {
      const { head, buffer } = call(body);
      ProxyInstance.write(buffer);
      // 为 EventEmitter 注册事件
      ProxyInstance.TarsusEvents.on("1", function (args) {
        const _to_json_ = JSON.stringify(args);
        if (!res.destroyed) {
          res.json(_to_json_);
        }
      });
    } else {
      return 0;
    }
  }

  static MicroServices: Map<string, TarsusProxy>;

  static boost() {
    proxyService.link_service();
  }

  static link_service() {
    let cwd = process.cwd();
    let config_path = path.resolve(cwd, "server.json");
    const config = JSON.parse(readFileSync(config_path, "utf-8"));
    nextTick(() => {
      proxyService.MicroServices = new Map<string, TarsusProxy>();
      config.servant.forEach((net: any) => {
        let proxy_instance = new TarsusProxy(net.host, parseInt(net.port));
        let isJava = net.type == "java";
        if (isJava) {
          proxy_instance.java = true;
        }
        const { key } = proxy_instance;
        console.log("key", key);
        proxyService.MicroServices.set(key, proxy_instance);
      });
    });
  }

}
