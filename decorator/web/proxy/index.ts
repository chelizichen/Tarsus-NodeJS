import { Socket } from 'net'


/**
 * @description 微服务接口代理层
 */
class ArcProxy {
  static createkey(host: string, port: number) {
    return `-h ${host} -p ${port}`;
  }

  java = false;

  socket: Socket;
  host: string;
  port: number;
  key: string;
  intervalConnect: any = false;
  _config_info_: any;

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;

    this.socket = new Socket();

    this.register_events();

    this.connect();
    this.key = ArcProxy.createkey(host, port);
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
    return new Promise((resolve, reject) => {
      this.socket.write(buf, async (err) => {
        if (err) {
          reject(err);
        }
        const data = await this.recieve_from_microService();
        resolve(data);
      });
    });
  }

  recieve_from_microService() {
    return new Promise((resolve) => {
      this.socket.on("data", function (chunk: Buffer) {
        resolve(chunk);
      });
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

export {
  ArcProxy
}