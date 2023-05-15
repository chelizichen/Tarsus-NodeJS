import { call } from "../../microservice/utils/call";
import { TarsusProxy } from "../proxy";
import { parseToObj } from "../../util/servant";
import axios from "axios";
import { Request, Response } from "express";
import { TarsusLoadBalance } from "../../gateway/LoadBalance";


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
   * @description 存储Http转发地址的 Map
   * @type {Map<string,TarsusProxy>}
   */
  static HttpServices: Map<string, parseToObj> = new Map();

  static transmit(req: any, res: Response) {
    let { body, query } = req;
    let merge = Object.assign({},body,query)
    const { proxy } = body;
    TarsusLoadBalance.getServantToRequest(proxy,merge,res)
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
