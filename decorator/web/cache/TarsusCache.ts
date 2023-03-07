import { nextTick } from "process";
import { RedisClientType, createClient } from "redis";
import path from "path";
import { cwd } from "process";
import { ServantUtil } from "../../util/servant";
import { proxyService } from "../service/proxyService";
import { TarsusProxy } from "../proxy";

class TarsusCache {
  RedisTemplate: RedisClientType;
  config: Record<string, any>;
  constructor() {
    this.getMsServer();
  }

  public async getMsServer() {
    this.RedisTemplate = createClient();
    this.RedisTemplate.connect();
    const config_path = path.resolve(cwd(), "tarsus.config.js");
    const config = require(config_path);
    const servant = ServantUtil.parse(config.servant.project).serverName;
    nextTick(async () => {
      // 从redis 中读取 相关服务名，然后启动
      const data = await this.RedisTemplate.SMEMBERS(servant);
      data.forEach((item) => {
        const toObj = ServantUtil.parse(item);
        console.log(toObj);
        
        let proxy_instance = new TarsusProxy(toObj.host, Number(toObj.port));
        toObj.language == "java" ? (proxy_instance.java = true) : "";
        const { key } = proxy_instance;
        proxyService.MicroServices.set(key, proxy_instance);
      });
    });
  }
}

export { TarsusCache };
