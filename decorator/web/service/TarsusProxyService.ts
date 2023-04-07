import { call } from "../../microservice/utils/call";
import { TarsusProxy } from "../proxy";
import { parseToObj } from "../../util/servant";
import axios from "axios";
import { Request, Response } from "express";


// {
//     "interFace":"DemoInterFace",
//     "method":"say",
//     "data":{
//         "name":"一个大帅哥啊",
//         "age":"22"
//     },
//     "proxy":"NodeDemo",
//     "timeout":"6000"
// }

class TarsusProxyService {
  /**
   * @description 存储TarsusProxy实例的 Map
   * @type {Map<string,TarsusProxy>}
   */
  static MicroServices: Map<string, TarsusProxy> = new Map();

  /**
   * @description 存储Http转发地址的 Map
   * @type {Map<string,TarsusProxy>}
   */
  static HttpServices: Map<string, parseToObj> = new Map();

  static transmit(req: any, res: Response) {
    let { body, query } = req;
    let merge = Object.assign({},body,query)
    const { proxy } = body;
    let ProxyInstance = TarsusProxyService.MicroServices.get(proxy);
    if (ProxyInstance) {
      try {
        const str = call(merge);
        let curr = String(ProxyInstance.uid);
        ProxyInstance.TarsusEvents.on(curr, function (args) {
          const _to_json_ = JSON.parse(args);
          if (!res.destroyed) {
            res.json(_to_json_);
          }
        });
        ProxyInstance.write(str);
      } catch (e) {
        const error = {
          code: "-91000",
          message: e.message
        }
        res.json(error);
      }

      // 为 EventEmitter 注册事件
    } else {
      return 0;
    }
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
