import {Server, Socket, createServer} from "net";
import load_ms_app from "../load_server/load_ms_app";
import {call, proto} from "../../decorator/http/call";
import stream_proxy from "./taro_proxy";
import {EventEmitter} from "events";
import {uid} from "uid";
import { FastStringify } from "../load_schema";

type ConnOpt = { port: number; host: string };

enum RecieveData{ 
    proxyReq="proxyReq",
}

class Receive_Data {
    public Net!: Server;
    public socket!: Socket;

    static CrossEvents = new EventEmitter();

    constructor(opts: ConnOpt) {
        const {port, host} = opts;
        this.createServer({port, host});
        console.log("server start at " + host + ":" + port);
    }

    /**
     * @description 跨服务调用接口
     */
    static CrossRequest(data:Record<string,any>):Promise<any>{
        const eid = uid(8)
        const args = call(data)
        const proxy:string = data.proxy;
        const buf = Buffer.alloc(args.length + 24)
        buf.write(eid,0)
        buf.write(proxy,8,16)
        buf.write(args,24)
        Receive_Data.CrossEvents.emit(RecieveData.proxyReq,buf)
        return new Promise((resolve)=>{
            Receive_Data.CrossEvents.once(eid,function (data:Buffer){
                // 这拿到的数据是JSON
                let toString = data.subarray(8,data.length).toString("utf-8")
                let toObject = JSON.parse(toString)
                resolve(toObject)
            })
        })
    }

    createServer({port, host}: ConnOpt) {
        // 绑定this
        let bind_recieve = this.receive.bind(this);
        let bind_connection = this.connection.bind(this);
        let bind_err = this.error.bind(this);

        this.Net = createServer((socket) => {
            this.socket = socket;
            this.socket.on("data", bind_recieve);
            this.socket.on("error", bind_err);
            this.Net.on("connection", bind_connection);
        });
        this.Net.listen(port, host);

        Receive_Data.CrossEvents.on(RecieveData.proxyReq, (buffer:Buffer)=>{
            this.socket.write(buffer)
        })
    }

    async receive(data: Buffer) {
        console.log("receive data -- ", data.toString());
        let getId = data.subarray(0,8).toString("utf-8")

        if(Receive_Data.CrossEvents.listenerCount(getId) > 0){
            Receive_Data.CrossEvents.emit(getId,data)
            return;
        }

        data = data.subarray(8, data.length)
        let head_end = data.indexOf("[##]");
        let timeout = Number(this.unpkgHead(2, data));
        let body_len = Number(this.unpkgHead(3, data));

        let _request = this.unpkgHead(4, data, true)

        debugger
        let head = data.subarray(0, data.indexOf(proto[2]));

        let {request, response} = stream_proxy.StreamMap[head.toString()];

        if (request != _request.toString()) {
            let data = {
                code: "-500",
                message: `Tarsus-Error :  请求参数不匹配 ${request} != ${_request.toString()}`
            }
            let toJson = JSON.stringify(data);
            let len = Buffer.from(toJson).byteLength;
            let buf = Buffer.alloc(len + 8);
            buf.write(getId, 0);
            buf.write(toJson, 8);
            this.socket.write(buf, function (err) {
                if (err) {
                    console.log("服务端写入错误", err);
                }
                console.log("服务端写入成功");
            });
            return;
        }


        let getRequestClass = stream_proxy.TarsusStream.get_struct(request);
        let requestParams = []

        let body = data.subarray(head_end + 4, body_len + head_end + 4);

        let _body = JSON.parse(body.toString("utf-8"))
        let requestArg = new getRequestClass(..._body);
        let responseArg = stream_proxy.Parse({req: response, data: {}})

        requestParams.push(requestArg);
        requestParams.push(responseArg);

        Promise.race([
            this.timeout(timeout),
            load_ms_app.interface_events.emit(head, ...requestParams),
        ])
            .then((res: any) => {
                console.log(res);
                console.log('1');
                let toJson = FastStringify(response,res);
                console.log('2');
                
                let len = Buffer.from(toJson).byteLength;
                let buf = Buffer.alloc(len + 8);

                buf.write(getId.toString(), 0);
                buf.write(toJson, 8);
                console.log('写出的buf', buf.toString());
                this.socket.write(buf, function (err) {
                    if (err) {

                        console.log("服务端写入错误", err);
                    }
                    console.log("服务端写入成功");
                });
            })
            .catch((err: any) => {
                this.socket.write(err, function (err) {
                    if (err) {
                        console.log("服务端写入错误", err);
                    }
                    console.log("服务端写入成功");
                });
            });
    }

    error(err: Error) {
        console.log("tarsus-ms-err", err);
    }

    // 需要储存一份网关的数据
    connection(...args:any[]) {
        console.log(args)
        console.log("有新用户链接");
    }

    /**
     * @param buf
     * @description 新版的解析参数方法
     * 直接JSON拿到
     * 效果和原来一样
     */
    unpackage(buf: Buffer) {
        return JSON.parse(buf.toString() || "{}");
    }


    /**
     * @description 首部拆包得到字段
     * @param {number} start  根据协议头部定义得到相关字段
     * @summary 目前协议定义 1 interFace 接口 2 method 方法 3 timeout 超时时间 4 body_len 方法体的长度
     */

    unpkgHead(start: number, data: Buffer): string;

    unpkgHead(start: number, data: Buffer, end: boolean): string;

    unpkgHead(start: number, data: Buffer, end?: boolean): string {
        let start_index = data.indexOf(proto[start]);
        let start_next: number = 0;
        if (end) {
            start_next = data.indexOf(proto[proto.length - 1]);
        } else {
            start_next = data.indexOf(proto[start + 1]);
        }
        let timeout = data
            .subarray(start_index + proto[start].length, start_next)
            .toString("utf-8");
        return timeout;
    }

    timeout(time: number) {
        return new Promise((_: any, rej: any) => {
            let _time = setTimeout(() => {
                rej("请求超时");
                clearTimeout(_time);
            }, time);
        });
    }
}

export default Receive_Data;
