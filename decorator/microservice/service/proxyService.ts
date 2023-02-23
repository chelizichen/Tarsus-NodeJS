import { readFileSync } from "fs";
import path from "path";
import { nextTick } from "node:process";
import { call } from "../utils/call";
import { TarsusProxy } from "../../web/proxy";

export class proxyService {
  static async transmit(body: any) {
    console.log(body);
    const { key } = body;

    let Arc_ProxyInstance = proxyService.MicroServices.get(key);

    if (Arc_ProxyInstance) {
      const buf = call(body);
      const data = await Arc_ProxyInstance.write(buf);
      return data;
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

  static async log() {
    // @ts-ignore
    let proxy_instance = new ArcProxy("127.0.0.1", parseInt("10012"));
  }
}
