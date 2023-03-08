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

// decorator/web/orm/Entity.ts
var Entity_exports = {};
__export(Entity_exports, {
  Column: () => Column,
  Entity: () => Entity,
  EntityMap: () => EntityMap
});
module.exports = __toCommonJS(Entity_exports);

// decorator/ioc/collects.ts
var IocMap = /* @__PURE__ */ new Map();

// decorator/web/orm/Entity.ts
var EntityMap = /* @__PURE__ */ new Map();
var ColumnMap = /* @__PURE__ */ new Map();
var Entity = (table) => {
  return function(value, context) {
    IocMap.set(value.name, new value());
    context.addInitializer(() => {
      EntityMap.set(value.name, ColumnMap);
      ColumnMap.clear();
      console.log("EntityMap", EntityMap);
    });
  };
};
var Column = (field, context) => {
  if (field && !context) {
    return function(value, ctx) {
      ctx.addInitializer(() => {
        ColumnMap.set(ctx.name, field);
      });
    };
  } else {
    context.addInitializer(() => {
      ColumnMap.set(context.name, context.name);
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Column,
  Entity,
  EntityMap
});
