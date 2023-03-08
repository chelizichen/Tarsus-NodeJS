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

// decorator/microservice/interface/TarsusInterFace.ts
var TarsusInterFace_exports = {};
__export(TarsusInterFace_exports, {
  TarsusInterFace: () => TarsusInterFace,
  TarsusMethod: () => TarsusMethod,
  interFaceMap: () => interFaceMap,
  interFaceSet: () => interFaceSet
});
module.exports = __toCommonJS(TarsusInterFace_exports);

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

// decorator/microservice/interface/TarsusInterFace.ts
var interFaceMap = /* @__PURE__ */ new Map();
var interFaceSet = /* @__PURE__ */ new Set();
var TarsusMethod = (value, context) => {
  interFaceSet.add({
    func: value,
    method_name: context.name
  });
};
var TarsusInterFace = (interFace) => {
  return function(classValue, context) {
    interFaceSet.forEach((method) => {
      let { func, method_name } = method;
      func = func.bind(new classValue());
      const _method_name = TarsusEvent.get_fn_name(interFace, method_name);
      interFaceMap.set(_method_name, func);
    });
    interFaceSet.clear();
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TarsusInterFace,
  TarsusMethod,
  interFaceMap,
  interFaceSet
});
