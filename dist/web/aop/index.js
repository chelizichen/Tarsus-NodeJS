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

// decorator/web/aop/index.ts
var aop_exports = {};
__export(aop_exports, {
  UseInterCeptor: () => UseInterCeptor
});
module.exports = __toCommonJS(aop_exports);
function UseInterCeptor(interceptor) {
  return function(value, context) {
    let copy_value = value;
    value = async function(req) {
      const data = await interceptor.handle.call(this, req);
      if (data) {
        return data;
      } else {
        const data2 = await copy_value.call(this, req);
        return data2;
      }
    };
    return value;
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UseInterCeptor
});
