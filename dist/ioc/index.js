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

// decorator/ioc/index.ts
var ioc_exports = {};
__export(ioc_exports, {
  Collect: () => Collect,
  Inject: () => Inject
});
module.exports = __toCommonJS(ioc_exports);

// decorator/ioc/collects.ts
var IocMap = /* @__PURE__ */ new Map();

// decorator/ioc/collect.ts
var Collect = (value, context) => {
  IocMap.set(value.name, new value());
};

// decorator/ioc/inject.ts
var Inject = (injectAble) => {
  return (value, context) => {
    if (context.kind == "field") {
      return function() {
        let injectAbleClass = IocMap.get(injectAble.name);
        return injectAbleClass;
      };
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Collect,
  Inject
});
