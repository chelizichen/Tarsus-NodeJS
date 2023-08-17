import { Socket } from "net";
import { EventEmitter } from "events";
import os from 'os'
import moment from 'moment'
import {call} from "../decorator/http/call";
/**
 * @description
 * 数据转发层,每个链接都是一个 代理实例，上层只需要考虑如何进行数据传输
 */
class Data_Forward {
    public uid = 1;

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

    write(buf: string) {
        let len = Buffer.from(buf).byteLength;
        let new_buf = Buffer.allocUnsafe(len + 4);

        let new_str = "";
        // 如果为Java 则需要加尾判断
        if (this.java) {
            buf += "[#ENDL#]\n";
            new_str = this.join_buf(buf);
            this.socket.write(new_str, async (err) => {
                if (err) {
                    console.log(err);
                }
            });

        }
        // Nodejs 则正常通信 参照 taf-nodejs
        else {
            new_buf.writeUInt32BE(this.uid, 0);
            new_buf.write(buf, 4, "utf8");
            this.socket.write(new_buf, async (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        this.uid++;
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

    join_buf(buf: string): string {
        let len = String(this.uid).length;
        if (len == 1) {
            return "000" + this.uid + buf;
        } else if (len == 2) {
            return "00" + this.uid + buf;
        } else if (len == 3) {
            return "0" + this.uid + buf;
        } else if (len == 4) {
            return "" + this.uid + buf;
        }
    }

    receive_from_microService() {
        this.socket.on("data", (chunk: Buffer) => {
            let getId;
            let body;
            if (this.java) {
                getId = Number.parseInt(chunk.subarray(0, 4).toString());
            } else {
                getId = chunk.readUInt32BE(0);
            }
            body = chunk.subarray(4, chunk.length);
            console.log(body.toString());

            this.currEvents.emit(getId.toString(), body.toString());
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
