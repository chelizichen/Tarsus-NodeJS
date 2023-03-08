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

// decorator/web/controller/index.ts
var controller_exports = {};
__export(controller_exports, {
  Controller: () => Controller
});
module.exports = __toCommonJS(controller_exports);
var import_express = __toESM(require("express"));

// decorator/web/controller/routers.ts
var routers = /* @__PURE__ */ new Map();
var controllers = /* @__PURE__ */ new Set();

// decorator/web/controller/index.ts
var Controller = (interFace) => {
  return function(controller, context) {
    let router = (0, import_express.default)();
    context.addInitializer(() => {
      console.log(routers);
      routers.forEach((value, key) => {
        const { method, url } = key;
        const _controller = new controller();
        if (_controller.init) {
          _controller.init();
        }
        value = value.bind(_controller);
        let method_path = interFace + url;
        if (method == "get" /* GET */) {
          router.get(method_path, async (req, res) => {
            const data = await value(req);
            if (!res.destroyed) {
              res.json(data);
            }
          });
        }
        if (method == "post" /* POST */) {
          router.post(method_path, async (req, res) => {
            const data = await value(req);
            if (!res.destroyed) {
              res.json(data);
            }
          });
        }
        if (method == "proxy" /* Proxy */) {
          router.all(method_path, async (req, res) => {
            value(req, res);
          });
        }
      });
      routers.clear();
      controllers.add(router);
    });
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Controller
});
