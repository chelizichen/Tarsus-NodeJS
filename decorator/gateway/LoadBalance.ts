import os from 'os'
import { parseToObj } from '../util/servant';
import { TarsusProxy } from '../web';
import { Response } from "express";
import { call } from '../microservice/utils/call';

// 调用负载的请求
function T_LB_Request(url) {
    return {
        code: 0,
        message: "ok",
        data: 0.1
    }
}


/**
 * @TarsusLoadBalance 负载均衡 BaseClass
 * @description 
 * 在我的思维里，对项目进行配置时会配置他的所有IP和权重
 * 在GateWay里时会对每个代理IP创建一个链接实例，每分钟都会拿到负载的数据
 * 对 负载 / weight 得到合适的权重 再通过sort 进行排序
 * sort 后的 数组第一位即为当前负载最低的机器
 */
class TarsusLoadBalance {

    public hostList: Array<parseToObj & { currWeight: number } & { service: TarsusProxy }> = [];
    public totalWeight = 0;
    public servantName = ""
    /**
     * @description 得到操作系统上一分钟的负载信息 
     * */
    static getLastOneMinutes() {
        return os.loadavg()[0]
    }

    /**
     * @description 服务的Getter 和 Setter方法
     */
    static ServantMaps = new Map<string, TarsusLoadBalance>();

    static getServant(key: string) {
        return TarsusLoadBalance.ServantMaps.get(key)
    }

    static setServant(key: string, value: TarsusLoadBalance) {
        TarsusLoadBalance.ServantMaps.set(key, value)
    }

    // 拿到服务然后通过调用负载小的机器去执行请求。
    static getServantToRequest(key: string, Request: any, Response: Response) {
        const tarsusLoadBalance = TarsusLoadBalance.getServant(key)
        tarsusLoadBalance.ProxySendRequest(Request, Response)
    }
    constructor(hostList: Array<parseToObj & { currWeight: 0 } & { service: TarsusProxy }> = [], servantName: string) {
        this.servantName = servantName;
        // 给定权重列表
        this.hostList = hostList.map(item => {
            item.currWeight = 0;
            const { host, port } = item
            item.service = new TarsusProxy(host, Number(port))
            return item;
        })

        // 赋值全部的权重
        this.totalWeight = hostList.reduce((sum, server) => sum + Number(server.weight), 0);

        // 开启分钟轮询
        this.TimesSending()
    }


    /**
     * @description 轮询操作系统的负载
     *  */
    TimesSending() {
        setInterval(async () => {
            let arrs:any[] = await Promise.all(this.hostList.map(async item => {
                return new Promise((resolve)=>{
                    const { service, weight } = item;
                    // 拿到负载信息
                    let args = service.getLoadInfoArgs()
                    let curr = String(service.uid);
                    service.TarsusEvents.on(curr, function (ret) {
                        const LB = JSON.parse(ret);
                        let data = LB.data;
                        item.currWeight = Number((data / Number(weight)).toFixed(2))
                        resolve(item)
                    });
                    service.write(args);
                })
               
            }))
            arrs = arrs.sort((a, b) => a.weight - b.weight);
            this.hostList = arrs
        }, 1000)
    }

    /**
     * @description 根据这个代理去请求
     */
    ProxySendRequest(Request: any, Response: Response) {
        let ServantInst = this.hostList[0].service
        if (ServantInst) {
            try {
                const str = call(Request);
                let curr = String(ServantInst.uid);
                ServantInst.TarsusEvents.on(curr, function (args) {
                    const _to_json_ = JSON.parse(args);
                    if (!Response.destroyed) {
                        Response.json(_to_json_);
                    }
                });
                ServantInst.write(str);
            } catch (e) {
                const error = {
                    code: "-91000",
                    message: e.message
                }
                Response.json(error);
            }

            // 为 EventEmitter 注册事件
        } else {
            return 0;
        }
    }


    /**
     * @description 心跳检测
     */
    KeepAlive() {
        
    }
}


export {
    TarsusLoadBalance
}