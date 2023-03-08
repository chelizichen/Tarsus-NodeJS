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

// decorator/web/params/index.ts
var params_exports = {};
__export(params_exports, {
  Body: () => Body,
  Query: () => Query
});
module.exports = __toCommonJS(params_exports);
function Query() {
  return function(value, context) {
    console.log("QUERY \u88C5\u9970\u5668");
  };
}
function Body() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Body,
  Query
});
