import { Socket } from "net";
import { EventEmitter } from "node:events";
import { Response } from "express";
/**
 * @description 微服务接口代理层
 */
class TarsusProxy {
  static createkey(host: string, port: number) {
    return `-h ${host} -p ${port}`;
  }

  public java = false;
  public socket: Socket;
  public host: string;
  public port: number;
  public key: string;
  public intervalConnect: any = false;
  public _config_info_: any;

  public TarsusEvents = new EventEmitter();

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
    this.socket = new Socket();
    this.register_events();
    this.connect();
    this.key = TarsusProxy.createkey(host, port);
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
    this.recieve_from_microService()
  }

  connect() {
    this.socket.connect({
      host: this.host,
      port: this.port,
    });
  }

  write(buf: Buffer) {
    if (this.java) {
      const { concat, from } = Buffer;
      buf = concat([buf, from("[#ENDL#]\n")]);
    }
    this.socket.write(buf, async (err) => {
      console.log("写入成功");
      if (err) {
        console.log(err);
      }
    });
    // return new Promise((resolve, reject) => {
    //   this.socket.write(buf, async (err) => {
    //     if (err) {
    //       reject(err);
    //     }
    //     const data = await this.recieve_from_microService();
    //     resolve(data);
    //   });
    // });
  }

  recieve_from_microService() {
    this.socket.on("data", (chunk: Buffer) => {
      console.log("接收到消息",chunk.toString());
      
      this.TarsusEvents.emit("1", chunk.toString());
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
}

export { TarsusProxy };
