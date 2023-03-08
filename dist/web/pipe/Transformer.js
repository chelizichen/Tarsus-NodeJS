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

// decorator/web/pipe/Transformer.ts
var Transformer_exports = {};
__export(Transformer_exports, {
  class_transformer: () => class_transformer
});
module.exports = __toCommonJS(Transformer_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  class_transformer
});
