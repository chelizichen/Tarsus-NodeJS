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

// decorator/web/orm/sql.ts
var sql_exports = {};
__export(sql_exports, {
  Select: () => Select
});
module.exports = __toCommonJS(sql_exports);
var Select = (sql) => {
  return function(value, context) {
    const copy_value = value;
    value = async function(args) {
      let _args = {
        args,
        sql
      };
      return await copy_value(_args);
    };
    return value;
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Select
});
