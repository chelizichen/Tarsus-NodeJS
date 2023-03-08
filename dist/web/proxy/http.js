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

// decorator/web/proxy/http.ts
var http_exports = {};
__export(http_exports, {
  RequestFactory: () => RequestFactory
});
module.exports = __toCommonJS(http_exports);
var import_axios = __toESM(require("axios"));
function createkey(port, host) {
  return `-h ${host} -p ${port}`;
}
function RequestFactory(port, host) {
  const proxy_request = import_axios.default.create({
    timeout: 6e3,
    headers: { "Content-Type": "application/json;charset=utf-8" },
    baseURL: "http://localhost:5005/api/proxy/interceptor",
    method: "post"
  });
  proxy_request.interceptors.request.use(
    (config) => {
      if (!config.headers) {
        throw new Error(
          `Expected 'config' and 'config.headers' not to be undefined`
        );
      }
      config.data.key = createkey(port, host);
      if (!config.data.timeout) {
        config.data.timeout = "3000";
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return proxy_request;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RequestFactory
});
