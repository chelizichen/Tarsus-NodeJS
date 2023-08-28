import { Socket } from "net";
import { EventEmitter } from "events";
import os from 'os'
import moment from 'moment'
import {call} from "../../decorator/http/call";
import {crossEnum, crossproxy} from "./proxy_call";
/**
 * @description
 * 数据转发层,每个链接都是一个 代理实例，上层只需要考虑如何进行数据传输
 */
class Data_Forward {
    // public uid = 1;

    public java = false;
    public socket: Socket;
    public host: string;
    public port: number;

    public intervalConnect: any = false;

    public currEvents = new EventEmitter();
    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
        this.socket = new Socket();
        this.register_events();
        this.connect();
    }

    register_events() {
        this.socket.on("connect", async () => {
            this.clearIntervalConnect();
            console.log("connected to server", "TCP");
        });

        this.socket.on("error", (err) => {
            console.log(err, "TCP ERROR");
            this.launchIntervalConnect();
        });

        this.socket.on("close", () => {
            this.launchIntervalConnect();
        });

        this.socket.on("end", () => {
            this.launchIntervalConnect();
        });
        this.receive_from_microService();
    }

    connect() {
        this.socket.connect({
            host: this.host,
            port: this.port,
        });
    }

    write(eid:string,buf: string) {
        let len = Buffer.from(buf).byteLength;
        let new_buf = Buffer.allocUnsafe(len + 8);
        let new_str = "";
        // 如果为Java 则需要加尾判断
        if (this.java) {
            buf += "[#ENDL#]\n";
            new_str = eid + buf;
            // console.log("写入的数据 - java",new_str);
            this.socket.write(new_str, async (err) => {
                if (err) {
                    console.log(err);
                }
            });

        }
        // Nodejs 则正常通信 参照 taf-nodejs
        else {
            new_buf.write(eid, 0);
            new_buf.write(buf, 8, "utf8");
            this.socket.write(new_buf, async (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    }

    // 拿到负载信息
    getLoadInfoArgs(){
        let data = call({
            method:"getLoadInfo",
            interFace:"SystemInterFace",
            timeout:"6000",
            request:"GetSystemLoadInfoReq",
            data:{
                host: os.hostname(),
                time: moment(moment.now()).format("YYYY-MM-DD hh:mm:ss")
            },
        })
        return data
    }

    // join_buf(buf: string): string {
    //     let uid = uid(4);
    //     return uid + buf
    // }

    receive_from_microService() {
        this.socket.on("data", (chunk: Buffer) => {
            let getId = chunk.subarray(0,8);
            let body = chunk.subarray(8,chunk.length);
            console.log(body.toString());

            let eid = getId.toString("utf-8")
            if(this.currEvents.listenerCount(eid) > 0){
                return this.currEvents.emit(eid, body.toString("utf-8"));
            }


            // 如果 cross proxy 已有该id 的监听值 ，则代表是返回值
            if(crossproxy.listenerCount(eid)>0){
                crossproxy.emit(eid,body)
                return;
            }

            // 如果该链接没有事件没有获取到eid，则被认为是跨服务调用的Stream
            // 先一次性创建事件监听ID，拿到数据后再将该数据重新写入该链接完成调用
            this.currEvents.once(eid, (data:Buffer)=>{
                this.write(eid,data.toString())
            })

            // 调用跨服务的事件
            crossproxy.emit(crossEnum.sendRequest,eid,body,this.java)

            // 代理事件接收到eid 后 将数据传回至当前链接
            crossproxy.once(eid, (data)=>{
                this.currEvents.emit(eid,data)
            })
        });
    }

    recieve_from_client() {}

    launchIntervalConnect() {
        if (this.intervalConnect) {
            return;
        }
        this.intervalConnect = setInterval(() => this.connect(), 5000);
    }

    clearIntervalConnect() {
        if (!this.intervalConnect) {
            return;
        }
        clearInterval(this.intervalConnect);
        this.intervalConnect = false;
    }

    public isConnection(){
        return this.socket.connecting
    }
}

export default Data_Forward;
