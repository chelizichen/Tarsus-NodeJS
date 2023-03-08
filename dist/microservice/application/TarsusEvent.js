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

// decorator/microservice/application/TarsusEvent.ts
var TarsusEvent_exports = {};
__export(TarsusEvent_exports, {
  TarsusEvent: () => TarsusEvent
});
module.exports = __toCommonJS(TarsusEvent_exports);
var TarsusEvent = class {
  static get_fn_name(interFace, method) {
    let fn_name = "[#1]" + interFace + "[#2]" + method;
    return fn_name;
  }
  constructor() {
    this.events = {};
  }
  register(Head, CallBack) {
    this.events[Head] = CallBack;
  }
  async emit(Head, ...args) {
    let head = Head.toString();
    return await this.events[head](...args);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TarsusEvent
});
