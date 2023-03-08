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
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// decorator/web/application/TarsusServer.ts
var TarsusServer_exports = {};
__export(TarsusServer_exports, {
  TarsusHttpApplication: () => TarsusHttpApplication,
  loadController: () => loadController,
  loadInit: () => loadInit,
  loadServer: () => loadServer
});
module.exports = __toCommonJS(TarsusServer_exports);
var import_express = __toESM(require("express"));

// decorator/web/controller/routers.ts
var controllers = /* @__PURE__ */ new Set();

// decorator/web/application/index.ts
var import_node_events = require("events");
var ApplicationEvents = new import_node_events.EventEmitter();

// decorator/web/application/TarsusServer.ts
var import_process3 = require("process");
var import_path3 = __toESM(require("path"));

// decorator/web/orm/TarsusOrm.ts
var mysql = __toESM(require("mysql"));

// decorator/web/orm/Entity.ts
var EntityMap = /* @__PURE__ */ new Map();

// decorator/web/orm/TarsusOrm.ts
var TarsusOrm = class {
  static getConnection() {
  }
  static CreatePool(config) {
    if (config && config.database) {
      if (config.database instanceof Array) {
        config.database.forEach(async (item) => {
          if (item.default) {
            const pool = await mysql.createPool({
              host: item.host,
              user: item.username,
              password: item.password,
              database: item.database,
              port: item.port,
              connectionLimit: item.connectionLimit
            });
            TarsusOrm.ConnectionPool = pool;
          }
        });
      }
    }
  }
  static async query(prepareSqlAndArgs, Class) {
    return new Promise(async (resolve, reject) => {
      const { sql, args } = prepareSqlAndArgs;
      console.log(prepareSqlAndArgs);
      TarsusOrm.ConnectionPool.getConnection((err, conn) => {
        if (err) {
          reject(err);
        }
        conn.query(sql, args, function(err2, resu) {
          if (err2) {
            reject(err2);
          }
          if (resu && resu.length) {
            const fields = EntityMap.get(Class.name);
            const data = resu.map((item) => {
              const toObjFields = [...fields.entries()].reduce(
                (obj, [key, value]) => (obj[key] = value, obj),
                {}
              );
              for (let k in toObjFields) {
                toObjFields[k] = item[toObjFields[k]];
              }
              return toObjFields;
            });
            resolve(data);
          } else {
            resolve(resu);
          }
        });
      });
    });
  }
  getList() {
    console.log("Get List Test");
  }
};

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
    return obj;
  }
};
ServantUtil.params = [
  { key: "-l", param: "language" },
  { key: "-t", param: "type" },
  { key: "-h", param: "host" },
  { key: "-p", param: "port" }
];

// decorator/web/service/proxyService.ts
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
var import_node_events2 = require("events");
var TarsusProxy = class {
  constructor(host, port) {
    this.uid = 1;
    this.java = false;
    this.intervalConnect = false;
    this.TarsusEvents = new import_node_events2.EventEmitter();
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

// decorator/web/service/proxyService.ts
var proxyService = class {
  static transmit(body, res) {
    const { key } = body;
    let ProxyInstance = proxyService.MicroServices.get(key);
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
    proxyService.link_service();
  }
  static link_service() {
    let cwd3 = process.cwd();
    let config_path = import_path.default.resolve(cwd3, "server.json");
    const config = JSON.parse((0, import_fs.readFileSync)(config_path, "utf-8"));
    (0, import_node_process.nextTick)(() => {
      proxyService.MicroServices = /* @__PURE__ */ new Map();
      config.servant.forEach((net) => {
        let proxy_instance = new TarsusProxy(net.host, parseInt(net.port));
        let isJava = net.type == "java";
        if (isJava) {
          proxy_instance.java = true;
        }
        const { key } = proxy_instance;
        console.log("key", key);
        proxyService.MicroServices.set(key, proxy_instance);
      });
    });
  }
};

// decorator/cache/TarsusCache.ts
var import_process = require("process");
var import_redis = require("redis");
var import_path2 = __toESM(require("path"));
var import_process2 = require("process");
var TarsusCache = class {
  constructor() {
    this.RedisTemplate = (0, import_redis.createClient)();
    this.RedisTemplate.connect();
    const config_path = import_path2.default.resolve((0, import_process2.cwd)(), "tarsus.config.js");
    this.config = require(config_path);
    this.servantName = ServantUtil.parse(this.config.servant.project).serverName;
    this.servant = this.config.servant.project;
    this.proxyName = this.config.servant.proxy;
  }
  async getMsServer() {
    (0, import_process.nextTick)(async () => {
      const data = await this.RedisTemplate.SMEMBERS(this.servantName);
      console.log("\u52A0\u8F7D\u6240\u6709\u7684\u5FAE\u670D\u52A1\u6A21\u5757", data);
      data.forEach((item) => {
        const toObj = ServantUtil.parse(item);
        let proxy_instance = new TarsusProxy(toObj.host, Number(toObj.port));
        toObj.language == "java" ? proxy_instance.java = true : "";
        const { key } = proxy_instance;
        proxyService.MicroServices.set(key, proxy_instance);
      });
    });
  }
  async setServant() {
    this.RedisTemplate.sAdd(this.proxyName, this.servant);
  }
};

// decorator/web/application/TarsusServer.ts
function loadController(args) {
  args.forEach((el) => {
    console.log(el.name, " is  loader success");
  });
  ApplicationEvents.emit("loadserver" /* LOAD_SERVER */);
}
function loadServer(config) {
  ApplicationEvents.emit("loadconfig" /* LOAD_CONFIG */, config);
  ApplicationEvents.emit("loadlisten" /* LOAD_LISTEN */);
}
function loadInit(callback) {
  ApplicationEvents.on("loadinit" /* LOAD_INIT */, (app) => {
    callback(app);
  });
}
function loadMs() {
  (0, import_process3.nextTick)(async () => {
    proxyService.MicroServices = /* @__PURE__ */ new Map();
    let cache = new TarsusCache();
    await cache.getMsServer();
  });
}
var TarsusHttpApplication = (value, context) => {
  context.addInitializer(() => {
    const app = (0, import_express.default)();
    app.use(import_express.default.json());
    const config_path = import_path3.default.resolve((0, import_process3.cwd)(), "tarsus.config.js");
    const _config = require(config_path);
    const SERVER = _config.servant.project;
    const parsedServer = ServantUtil.parse(SERVER);
    const port = parsedServer.port || 8080;
    ApplicationEvents.on("loadconfig" /* LOAD_CONFIG */, function(props) {
      ApplicationEvents.emit("loaddatabase" /* LOAD_DATABASE */, _config);
      if (props && props.ms) {
        ApplicationEvents.emit("loadms" /* LOAD_MS */, _config);
      }
    });
    ApplicationEvents.on("loaddatabase" /* LOAD_DATABASE */, TarsusOrm.CreatePool);
    ApplicationEvents.on("loadms" /* LOAD_MS */, loadMs);
    ApplicationEvents.on(
      "loadpipe" /* LOAD_PIPE */,
      function(args) {
        args.forEach((pipe) => {
          let _pipe = new pipe();
          app.use("*", (req, res, next) => _pipe.next(req, res, next));
        });
      }
    );
    ApplicationEvents.on("loadserver" /* LOAD_SERVER */, () => {
      controllers.forEach((value2) => {
        app.use(value2);
      });
    });
    ApplicationEvents.on("loadlisten" /* LOAD_LISTEN */, () => {
      (0, import_process3.nextTick)(() => {
        ApplicationEvents.emit("loadinit" /* LOAD_INIT */, app);
        app.listen(port, function() {
          console.log("Server started at port: ", port);
        });
      });
    });
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TarsusHttpApplication,
  loadController,
  loadInit,
  loadServer
});
