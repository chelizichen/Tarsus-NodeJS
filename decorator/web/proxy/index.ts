import { Socket } from "net";
import { EventEmitter } from "node:events";
/**
 * @description 微服务接口代理层
 */
class TarsusProxy {
  static createkey(host: string, port: number) {
    return `-h ${host} -p ${port}`;
  }

  public uid = 1;

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
    this.recieve_from_microService();
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
    if (this.java) {
      buf += "[#ENDL#]\n";
      new_str = this.join_buf(buf);
      this.socket.write(new_str, async (err) => {
        if (err) {
          console.log(err);
        }
      });
    } else {
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

  recieve_from_microService() {
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

      this.TarsusEvents.emit(getId.toString(), body.toString());
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
