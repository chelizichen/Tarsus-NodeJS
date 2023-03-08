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

// decorator/web/pipe/index.ts
var pipe_exports = {};
__export(pipe_exports, {
  UsePipe: () => UsePipe,
  class_transformer: () => class_transformer,
  loadGlobalPipe: () => loadGlobalPipe
});
module.exports = __toCommonJS(pipe_exports);

// decorator/web/pipe/Transformer.ts
var _ = __toESM(require("lodash"));
var class_transformer = class {
  static plainToClass(plain, Class) {
    const inst = new Class();
    const ret_plain = _.assignIn(inst, plain);
    return ret_plain;
  }
  static classToPlain(ClassInstance, filterKey) {
    const keys = Object.getOwnPropertyNames(ClassInstance);
    const get = keys.map((el) => {
      return filterKey.indexOf(el) == -1 ? el : void 0;
    }).filter((el) => el);
    return this.__classToPlain__(get, ClassInstance);
  }
  static __classToPlain__(get, inst) {
    const plain = {};
    get.forEach((el) => {
      plain[el] = inst[el];
    });
    return plain;
  }
};

// decorator/web/pipe/common.ts
var UsePipe = () => {
};

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

// decorator/web/proxy/index.ts
var import_node_events = require("events");

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
  UsePipe,
  class_transformer,
  loadGlobalPipe
});
