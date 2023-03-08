import { readFileSync } from "fs";
import path from "path";
import { nextTick } from "node:process";
import { call } from "../../microservice/utils/call";
import { TarsusProxy } from "../proxy";
import { parseToObj } from "../../util/servant";
import axios from "axios";
import { Request, Response } from "express";

class TarsusProxyService {
  /**
   * @description 存储TarsusProxy实例的 Map
   * @type {Map<string,TarsusProxy>}
   */
  static MicroServices: Map<string, TarsusProxy>;

  /**
   * @description 存储Http转发地址的 Map
   * @type {Map<string,TarsusProxy>}
   */
  static HttpServices: Map<string, parseToObj>;

  static transmit(req: any, res: Response) {
    let { body,query } = req;
    let merge = Object.assign({},body,query)
    merge.data["EndData"] = "End";

    const { key } = body;
    let ProxyInstance = TarsusProxyService.MicroServices.get(key);
    if (ProxyInstance) {
      const str = call(body);

      let curr = String(ProxyInstance.uid);
      ProxyInstance.TarsusEvents.on(curr, function (args) {
        const _to_json_ = JSON.parse(args);
        if (!res.destroyed) {
          res.json(_to_json_);
        }
      });

      ProxyInstance.write(str);
      // 为 EventEmitter 注册事件
    } else {
      return 0;
    }
  }

  static boost() {
    TarsusProxyService.link_service();
  }

  static link_service() {
    let cwd = process.cwd();
    let config_path = path.resolve(cwd, "server.json");
    const config = JSON.parse(readFileSync(config_path, "utf-8"));
    nextTick(() => {
      TarsusProxyService.MicroServices = new Map<string, TarsusProxy>();
      config.servant.forEach((net: any) => {
        let proxy_instance = new TarsusProxy(net.host, parseInt(net.port));
        let isJava = net.type == "java";
        if (isJava) {
          proxy_instance.java = true;
        }
        const { key } = proxy_instance;
        console.log("key", key);
        TarsusProxyService.MicroServices.set(key, proxy_instance);
      });
    });
  }

  static proxy_request = axios.create({
    timeout: 6000,
    headers: { "Content-Type": "application/json;charset=utf-8" },
    // 接口代理地址
  });

  static async request(req: Request, res: Response) {
    const toMerge = Object.assign({}, req.query, req.body);
    const { proxy, data, url, method } = toMerge;
    // 拿到服务完整名称
    const target = TarsusProxyService.HttpServices.get(proxy);

    const targetUrl = "http://" + target.host + ":" + target.port;

    TarsusProxyService.proxy_request({
      url: targetUrl + url,
      method,
      params: method == "get" ? data : undefined,
      data: method == "post" ? data : undefined,
    }).then((ret) => {
      res.json(ret);
    });
  }
}

export { TarsusProxyService };
