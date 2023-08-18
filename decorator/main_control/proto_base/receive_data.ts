import {Server, Socket, createServer} from "net";
import load_ms_app from "../load_server/load_ms_app";
import {proto} from "../decorator/http/call";
import stream_proxy from "./taro_proxy";

type ConnOpt = { port: number; host: string };

class Receive_Data {
    public Net!: Server;
    public socket!: Socket;

    constructor(opts: ConnOpt) {
        const {port, host} = opts;
        this.createServer({port, host});
        console.log("server start at " + host + ":" + port);
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
    }

    async receive(data: Buffer) {
        console.log("receive data -- ", data.toString());

        let getId = data.readInt32BE(0)
        data = data.subarray(4, data.length)
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
            let buf = Buffer.alloc(len + 4);
            buf.writeUInt32BE(getId, 0);
            buf.write(toJson, 4);
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

                let toJson = JSON.stringify(res);
                let len = Buffer.from(toJson).byteLength;
                let buf = Buffer.alloc(len + 4);

                buf.writeUInt32BE(getId, 0);
                buf.write(toJson, 4);
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

    connection() {
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
