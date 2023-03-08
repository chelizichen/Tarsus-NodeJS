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

// decorator/web/orm/TarsusOrm.ts
var TarsusOrm_exports = {};
__export(TarsusOrm_exports, {
  TarsusOrm: () => TarsusOrm
});
module.exports = __toCommonJS(TarsusOrm_exports);
var mysql = __toESM(require("mysql"));

// decorator/web/orm/Entity.ts
var EntityMap = /* @__PURE__ */ new Map();

// decorator/web/orm/TarsusOrm.ts
var TarsusOrm = class {
  static getConnection() {
  }
  static CreatePool(config) {
    if (config && config.database) {
      if (config.database instanceof Array) {
        config.database.forEach(async (item) => {
          if (item.default) {
            const pool = await mysql.createPool({
              host: item.host,
              user: item.username,
              password: item.password,
              database: item.database,
              port: item.port,
              connectionLimit: item.connectionLimit
            });
            TarsusOrm.ConnectionPool = pool;
          }
        });
      }
    }
  }
  static async query(prepareSqlAndArgs, Class) {
    return new Promise(async (resolve, reject) => {
      const { sql, args } = prepareSqlAndArgs;
      console.log(prepareSqlAndArgs);
      TarsusOrm.ConnectionPool.getConnection((err, conn) => {
        if (err) {
          reject(err);
        }
        conn.query(sql, args, function(err2, resu) {
          if (err2) {
            reject(err2);
          }
          if (resu && resu.length) {
            const fields = EntityMap.get(Class.name);
            const data = resu.map((item) => {
              const toObjFields = [...fields.entries()].reduce(
                (obj, [key, value]) => (obj[key] = value, obj),
                {}
              );
              for (let k in toObjFields) {
                toObjFields[k] = item[toObjFields[k]];
              }
              return toObjFields;
            });
            resolve(data);
          } else {
            resolve(resu);
          }
        });
      });
    });
  }
  getList() {
    console.log("Get List Test");
  }
  // static async queryTest(sql:string){
  //   const data = await ArcOrm.ConnectionPool.query(sql);
  //   return data;
  // }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TarsusOrm
});
