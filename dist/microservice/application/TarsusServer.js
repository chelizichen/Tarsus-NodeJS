var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// decorator/microservice/application/TarsusServer.ts
var TarsusServer_exports = {};
__export(TarsusServer_exports, {
  TarsusServer: () => TarsusServer
});
module.exports = __toCommonJS(TarsusServer_exports);
var import_net = require("net");

// decorator/microservice/application/TarsusEvent.ts
var TarsusEvent = class {
  static get_fn_name(interFace, method) {
    let fn_name = "[#1]" + interFace + "[#2]" + method;
    return fn_name;
  }
  constructor() {
    this.events = {};
  }
  /**
   * @description 注册远程方法
   * @param Head -> Buffer
   * @param CallBack -> Function
   */
  register(Head, CallBack) {
    this.events[Head] = CallBack;
  }
  /**
   * @method emit
   * @description 调用远程方法
   */
  async emit(Head, ...args) {
    let head = Head.toString();
    return await this.events[head](...args);
  }
};

// decorator/microservice/pkg/index.ts
var size = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "-",
  "=",
  "/",
  ".",
  ","
].map((item) => {
  return "#" + item + "#";
});
var proto = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "#"
].map((item) => {
  return "[#" + item + "]";
});

// decorator/microservice/application/TarsusServer.ts
var TarsusServer = class {
  constructor(opts) {
    const { port, host } = opts;
    this.createServer({ port, host });
    this.ArcEvent = new TarsusEvent();
    console.log("server start at " + host + ":" + port);
  }
  registEvents(events) {
    events.forEach((func, key) => {
      this.ArcEvent.register(key, func);
    });
  }
  createServer({ port, host }) {
    let bind_recieve = this.recieve.bind(this);
    let bind_connection = this.connection.bind(this);
    let bind_err = this.error.bind(this);
    this.Net = (0, import_net.createServer)((socket) => {
      this.socket = socket;
      this.socket.on("data", bind_recieve);
      this.socket.on("error", bind_err);
      this.Net.on("connection", bind_connection);
    });
    this.Net.listen(port, host);
  }
  async recieve(data) {
    console.log("\u63A5\u6536\u5230\u6D88\u606F", data.toString());
    let getId = data.readInt32BE(0);
    data = data.subarray(4, data.length);
    let head_end = data.indexOf("[##]");
    let timeout = Number(this.unpkgHead(2, data));
    let body_len = Number(this.unpkgHead(3, data, true));
    let head = data.subarray(0, data.indexOf(proto[2]));
    let body = data.subarray(head_end + 4, body_len + head_end + 4);
    let _body = this.unpacking(body);
    Promise.race([this.timeout(timeout), this.ArcEvent.emit(head, ..._body)]).then((res) => {
      let toJson = JSON.stringify(res);
      let len = Buffer.from(toJson).byteLength;
      let buf = Buffer.alloc(len + 4);
      buf.writeUInt32BE(getId, 0);
      buf.write(toJson, 4);
      this.socket.write(buf, function(err) {
        if (err) {
          console.log("\u670D\u52A1\u7AEF\u5199\u5165\u9519\u8BEF", err);
        }
        console.log("\u670D\u52A1\u7AEF\u5199\u5165\u6210\u529F");
      });
    }).catch((err) => {
      this.socket.write(err, function(err2) {
        if (err2) {
          console.log("\u670D\u52A1\u7AEF\u5199\u5165\u9519\u8BEF", err2);
        }
        console.log("\u670D\u52A1\u7AEF\u5199\u5165\u6210\u529F");
      });
    });
  }
  error(err) {
    console.log("ado-rpc-err", err);
  }
  connection() {
    console.log("\u6709\u65B0\u7528\u6237\u94FE\u63A5");
  }
  /**
   *
   * @param pkg Buffer
   * @returns value:any[]
   * @description 拆包 根据 start 和 end 拆包
   */
  unpacking(buf) {
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
        let isObject = buf.subarray(start, start + 6).toString() == size[init] + size[0];
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
  unpkgHead(start, data, end) {
    let start_index = data.indexOf(proto[start]);
    let start_next = 0;
    if (end) {
      start_next = data.indexOf(proto[proto.length - 1]);
    } else {
      start_next = data.indexOf(proto[start + 1]);
    }
    let timeout = data.subarray(start_index + proto[start].length, start_next).toString("utf-8");
    return timeout;
  }
  timeout(time) {
    return new Promise((_, rej) => {
      let _time = setTimeout(() => {
        rej("\u8BF7\u6C42\u8D85\u65F6");
        clearTimeout(_time);
      }, time);
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TarsusServer
});
