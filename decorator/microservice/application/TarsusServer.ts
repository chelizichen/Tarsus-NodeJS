import { createServer, Server, Socket } from "net";
import { TarsusEvent } from "./TarsusEvent";
import { proto, size } from "../pkg";

type ConnOpt = { port: number; host: string };

class TarsusServer {
  public Net!: Server;
  public socket!: Socket;
  public ArcEvent!: TarsusEvent;
  constructor(opts: ConnOpt) {
    const { port, host } = opts;
    this.createServer({ port, host });
    this.ArcEvent = new TarsusEvent();
    console.log("server start at " + host + ":" + port);
  }

  registEvents(events: Map<string, any>) {
    events.forEach((func, key) => {
      this.ArcEvent.register(key, func);
    });
  }

  createServer({ port, host }: ConnOpt) {
    // 绑定this
    let bind_recieve = this.recieve.bind(this);
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

  async recieve(data: Buffer) {
    console.log("接收到消息", data.toString());
    let getId = data.readInt32BE(0)
    data = data.subarray(4,data.length)
    let head_end = data.indexOf("[##]");
    let timeout = Number(this.unpkgHead(2, data));
    let body_len = Number(this.unpkgHead(3, data, true));
    let head = data.subarray(0, data.indexOf(proto[2]));
    let body = data.subarray(head_end + 4, body_len + head_end + 4);
    let _body = this.unpacking(body);
    Promise.race([this.timeout(timeout), this.ArcEvent.emit(head, ..._body)])
      .then((res: any) => {
        let toJson = JSON.stringify(res);
        let len = Buffer.from(toJson).byteLength;
        let buf = Buffer.alloc(len+4)
        
        buf.writeUInt32BE(getId,0)
        buf.write(toJson,4)
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
    console.log("ado-rpc-err", err);
  }

  connection() {
    console.log("有新用户链接");
  }

  /**
   *
   * @param pkg Buffer
   * @returns value:any[]
   * @description 拆包 根据 start 和 end 拆包
   */
  unpacking(buf: Buffer): any[] {
    let args = [];
    let init = 0;
    let start = buf.indexOf(size[init]);
    while (true) {
      let end_str = buf.subarray(start, start + 3).toString();
      let isEnd = end_str == size[size.length - 1];
      if (isEnd) {
        break;
      }
      let next = buf.indexOf(size[init + 1], start);
      if (next == -1) {
        let sub_pkg = buf.subarray(start, start + 6).toString();
        let is_un_pkg = sub_pkg == size[init] + size[0];
        // 判断是否为未分割的参数
        if (is_un_pkg) {
          let un_pkg = buf.subarray(start + 3, buf.length - 3);
          let getargs = this.unpacking(un_pkg);
          args[init] = getargs;
        } else {
          let un_pkg = buf.subarray(start + 3, buf.length - 3).toString();
          args[init] = un_pkg;
        }
        break;
      } else {
        let isObject =
          buf.subarray(start, start + 6).toString() == size[init] + size[0];
        if (isObject) {
          let end = buf.indexOf(size[size.length - 1] + size[init + 1]);
          let un_pkg = buf.subarray(start + 3, end + 3);
          let getargs = this.unpacking(un_pkg);
          args[init] = getargs;
          start = end + 3;
        } else {
          let getargs = buf.subarray(start + 3, next).toString();
          args[init] = getargs;
          start = next;
        }
      }
      init++;
    }
    return args;
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

export { TarsusServer };
