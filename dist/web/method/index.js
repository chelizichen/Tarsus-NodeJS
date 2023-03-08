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

// decorator/web/method/index.ts
var method_exports = {};
__export(method_exports, {
  Get: () => Get,
  METHODS: () => METHODS,
  Post: () => Post,
  Proxy: () => Proxy2
});
module.exports = __toCommonJS(method_exports);

// decorator/web/controller/routers.ts
var routers = /* @__PURE__ */ new Map();

// decorator/web/method/index.ts
var METHODS = /* @__PURE__ */ ((METHODS2) => {
  METHODS2["GET"] = "get";
  METHODS2["POST"] = "post";
  METHODS2["Proxy"] = "proxy";
  return METHODS2;
})(METHODS || {});
var Get = (url) => {
  return (value, context) => {
    routers.set({ url, method: "get" /* GET */ }, value);
  };
};
var Post = (url) => {
  return (value, context) => {
    routers.set({ url, method: "post" /* POST */ }, value);
  };
};
var Proxy2 = (url) => {
  return (value, context) => {
    routers.set({ url, method: "proxy" /* Proxy */ }, value);
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Get,
  METHODS,
  Post,
  Proxy
});
