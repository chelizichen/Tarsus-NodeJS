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

// decorator/web/pipe/global.ts
var global_exports = {};
__export(global_exports, {
  loadGlobalPipe: () => loadGlobalPipe
});
module.exports = __toCommonJS(global_exports);

// decorator/web/application/TarsusServer.ts
var import_express = __toESM(require("express"));

// decorator/web/orm/TarsusOrm.ts
var mysql = __toESM(require("mysql"));

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

// decorator/web/service/TarsusProxyService.ts
var import_fs = require("fs");
var import_path = __toESM(require("path"));
var import_node_process = require("process");

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
var import_net = require("net");
var import_node_events = require("events");
var TarsusProxy = class {
  constructor(host, port) {
    this.uid = 1;
    this.java = false;
    this.intervalConnect = false;
    this.TarsusEvents = new import_node_events.EventEmitter();
    this.host = host;
    this.port = port;
    this.socket = new import_net.Socket();
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
    let cwd = process.cwd();
    let config_path = import_path.default.resolve(cwd, "server.json");
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
var import_redis = require("redis");

// decorator/web/application/index.ts
var import_node_events2 = require("events");
var ApplicationEvents = new import_node_events2.EventEmitter();

// decorator/web/pipe/global.ts
function loadGlobalPipe(args) {
  ApplicationEvents.emit("loadpipe" /* LOAD_PIPE */, args);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  loadGlobalPipe
});
