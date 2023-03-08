var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// decorator/microservice/application/index.ts
var application_exports = {};
__export(application_exports, {
  TarsusMsApplication: () => TarsusMsApplication,
  TarsusServer: () => TarsusServer
});
module.exports = __toCommonJS(application_exports);
var import_fs2 = require("fs");
var import_process3 = require("process");

// decorator/microservice/application/TarsusServer.ts
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

// decorator/microservice/load/index.ts
var import_node_events = require("events");
var ApplicationEvents = new import_node_events.EventEmitter();

// decorator/microservice/application/index.ts
var import_path3 = __toESM(require("path"));

// decorator/util/servant.ts
var ServantUtil = class {
  static parse(servant) {
    let obj = {};
    this.params.map((param) => {
      const index = servant.indexOf(param.key);
      let end = servant.indexOf(" ", index + 3);
      if (end == -1) {
        end = servant.length;
      }
      let substr = servant.substring(index + 2, end).trim();
      obj[param.param] = substr;
      if (substr.endsWith("ms") && param.key == "-t") {
        obj[param.param] = "ms";
      }
      if (substr.endsWith("http") && param.key == "-t") {
        obj[param.param] = "http";
      }
    });
    let servant_end = servant.indexOf(" ");
    let servant_name = servant.substring(0, servant_end).trim();
    obj["serverName"] = servant_name;
    obj["serverGroup"] = servant_name.slice(1, servant_name.indexOf("/"));
    obj["serverProject"] = servant_name.slice(servant_name.indexOf("/") + 1);
    return obj;
  }
};
ServantUtil.params = [
  { key: "-l", param: "language" },
  { key: "-t", param: "type" },
  { key: "-h", param: "host" },
  { key: "-p", param: "port" }
];

// decorator/microservice/interface/TarsusInterFace.ts
var interFaceMap = /* @__PURE__ */ new Map();

// decorator/cache/TarsusCache.ts
var import_process = require("process");
var import_redis = require("redis");
var import_path2 = __toESM(require("path"));
var import_process2 = require("process");

// decorator/web/service/TarsusProxyService.ts
var import_fs = require("fs");
var import_path = __toESM(require("path"));
var import_node_process = require("process");

// decorator/microservice/utils/call.ts
function call(pkg) {
  const { method, data, interFace, timeout } = pkg;
  let args = getRequestArgs(data);
  let body = Buffer.from(args);
  let body_len = body.length;
  let head_str = getRequestHead(
    interFace,
    method,
    String(timeout),
    String(body_len)
  );
  let call_buf = head_str + body;
  return call_buf;
}
function getRequestHead(...args) {
  let head = "";
  args.forEach((item, index) => {
    head += proto[index] + item;
  });
  head += proto[proto.length - 1];
  return head;
}
function getRequestArgs(args) {
  if (typeof args == "string") {
    return args;
  }
  if (args instanceof Array) {
    return JSON.stringify(args);
  }
  if (typeof args == "object") {
    let init = 0;
    let _args = "";
    for (let v in args) {
      let _ret = getRequestArgs(args[v]);
      _args += size[init++] + _ret;
    }
    _args += size[size.length - 1];
    return _args;
  }
  return "";
}

// decorator/web/proxy/index.ts
var import_net2 = require("net");
var import_node_events2 = require("events");
var TarsusProxy = class {
  constructor(host, port) {
    this.uid = 1;
    this.java = false;
    this.intervalConnect = false;
    this.TarsusEvents = new import_node_events2.EventEmitter();
    this.host = host;
    this.port = port;
    this.socket = new import_net2.Socket();
    this.register_events();
    this.connect();
    this.key = TarsusProxy.createkey(host, port);
  }
  static createkey(host, port) {
    return `-h ${host} -p ${port}`;
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
      port: this.port
    });
  }
  write(buf) {
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
  join_buf(buf) {
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
    this.socket.on("data", (chunk) => {
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
  recieve_from_client() {
  }
  launchIntervalConnect() {
    if (this.intervalConnect) {
      return;
    }
    this.intervalConnect = setInterval(() => this.connect(), 5e3);
  }
  clearIntervalConnect() {
    if (!this.intervalConnect) {
      return;
    }
    clearInterval(this.intervalConnect);
    this.intervalConnect = false;
  }
};

// decorator/web/service/TarsusProxyService.ts
var import_axios = __toESM(require("axios"));
var _TarsusProxyService = class {
  static transmit(req, res) {
    let { body, query } = req;
    let merge = Object.assign({}, body, query);
    merge.data["EndData"] = "End";
    const { key } = body;
    let ProxyInstance = _TarsusProxyService.MicroServices.get(key);
    if (ProxyInstance) {
      const str = call(body);
      let curr = String(ProxyInstance.uid);
      ProxyInstance.TarsusEvents.on(curr, function(args) {
        const _to_json_ = JSON.parse(args);
        if (!res.destroyed) {
          res.json(_to_json_);
        }
      });
      ProxyInstance.write(str);
    } else {
      return 0;
    }
  }
  static boost() {
    _TarsusProxyService.link_service();
  }
  static link_service() {
    let cwd3 = process.cwd();
    let config_path = import_path.default.resolve(cwd3, "server.json");
    const config = JSON.parse((0, import_fs.readFileSync)(config_path, "utf-8"));
    (0, import_node_process.nextTick)(() => {
      _TarsusProxyService.MicroServices = /* @__PURE__ */ new Map();
      config.servant.forEach((net) => {
        let proxy_instance = new TarsusProxy(net.host, parseInt(net.port));
        let isJava = net.type == "java";
        if (isJava) {
          proxy_instance.java = true;
        }
        const { key } = proxy_instance;
        console.log("key", key);
        _TarsusProxyService.MicroServices.set(key, proxy_instance);
      });
    });
  }
  static async request(req, res) {
    const toMerge = Object.assign({}, req.query, req.body);
    const { proxy, data, url, method } = toMerge;
    const target = _TarsusProxyService.HttpServices.get(proxy);
    const targetUrl = "http://" + target.host + ":" + target.port;
    _TarsusProxyService.proxy_request({
      url: targetUrl + url,
      method,
      params: method == "get" ? data : void 0,
      data: method == "post" ? data : void 0
    }).then((ret) => {
      res.json(ret);
    });
  }
};
var TarsusProxyService = _TarsusProxyService;
TarsusProxyService.proxy_request = import_axios.default.create({
  timeout: 6e3,
  headers: { "Content-Type": "application/json;charset=utf-8" }
  // 接口代理地址
});

// decorator/cache/TarsusCache.ts
var TarsusCache = class {
  constructor() {
    this.RedisTemplate = (0, import_redis.createClient)();
    this.RedisTemplate.connect();
    const config_path = import_path2.default.resolve((0, import_process2.cwd)(), "tarsus.config.js");
    this.config = require(config_path);
    this.servantGroup = ServantUtil.parse(this.config.servant.project).serverGroup;
    this.servant = this.config.servant.project;
  }
  // 微服务网关所需要的代理层
  async getMsServer() {
    (0, import_process.nextTick)(async () => {
      const data = await this.RedisTemplate.SMEMBERS(this.servantGroup);
      console.log("\u52A0\u8F7D\u6240\u6709\u7684\u5FAE\u670D\u52A1\u6A21\u5757", data);
      data.forEach((item) => {
        const toObj = ServantUtil.parse(item);
        if (toObj.proto == "ms") {
          let proxy_instance = new TarsusProxy(toObj.host, Number(toObj.port));
          toObj.language == "java" ? proxy_instance.java = true : "";
          const { key } = proxy_instance;
          TarsusProxyService.MicroServices.set(key, proxy_instance);
        }
        if (toObj.proto == "http") {
          TarsusProxyService.HttpServices.set(toObj.serverName, toObj);
        }
      });
    });
  }
  async setServant() {
    this.RedisTemplate.sAdd(this.servantGroup, this.servant);
  }
};

// decorator/microservice/application/index.ts
var TarsusMsApplication = (value, context) => {
  context.addInitializer(() => {
    const config_path = import_path3.default.resolve((0, import_process3.cwd)(), "tarsus.config.js");
    const _config = require(config_path);
    const SERVER = _config.servant.project;
    const parsedServer = ServantUtil.parse(SERVER);
    const port = parsedServer.port || 8080;
    const host = parsedServer.host;
    console.log("parsedServer", parsedServer);
    ApplicationEvents.on("loadinterface" /* LOAD_INTERFACE */, function(args) {
      args.forEach((el) => {
        console.log(el.name, "is load");
      });
    });
    ApplicationEvents.on("require_interface" /* REQUIRE_INTERFACE */, function() {
      const register_path = _config.servant.src || "src/register";
      const full_path = import_path3.default.resolve((0, import_process3.cwd)(), register_path);
      const dirs = (0, import_fs2.readdirSync)(full_path);
      dirs.forEach((interFace) => {
        let interFace_path = import_path3.default.resolve(full_path, interFace);
        require(interFace_path);
      });
    });
    ApplicationEvents.on("loadmicroservice" /* LOAD_MICROSERVICE */, function() {
      const cache = new TarsusCache();
      cache.setServant();
      let arc_server = new TarsusServer({ port: Number(port), host });
      arc_server.registEvents(interFaceMap);
      console.log(arc_server.ArcEvent.events);
    });
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TarsusMsApplication,
  TarsusServer
});
