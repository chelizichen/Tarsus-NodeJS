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

// decorator/ioc/inject.ts
var inject_exports = {};
__export(inject_exports, {
  Inject: () => Inject,
  LazyInject: () => LazyInject
});
module.exports = __toCommonJS(inject_exports);

// decorator/ioc/collects.ts
var IocMap = /* @__PURE__ */ new Map();
var LazyIocMap = /* @__PURE__ */ new Map();

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
var LazyInject = (injectAble) => {
  return (value, context) => {
    if (context.kind == "field") {
      return function() {
        let injectAbleClass = LazyIocMap.get(injectAble.name);
        if (injectAbleClass.prototype) {
          let toInst = new injectAbleClass();
          LazyIocMap.set(injectAble.name, toInst);
          return toInst;
        } else {
          return injectAbleClass;
        }
      };
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Inject,
  LazyInject
});
