import * as mysql from "mysql";
import { EntityMap } from "./Entity";
import _ from "lodash";
// ORM 基类
class TarsusOrm {
  static getConnection() {}
  static ConnectionPool: mysql.Pool;

  static CreatePool(config: any) {
    if (config && config.database) {
      if (config.database instanceof Array) {
        config.database.forEach(async (item: any) => {
          if (item.default) {
            const pool = await mysql.createPool({
              host: item.host,
              user: item.username,
              password: item.password,
              database: item.database,
              port: item.port,
              connectionLimit: item.connectionLimit,
            });
            TarsusOrm.ConnectionPool = pool;
          }
        });
      }
    }
  }

  static async query(prepareSqlAndArgs: any, Class: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const { sql, args } = prepareSqlAndArgs;
      console.log(prepareSqlAndArgs);
      TarsusOrm.ConnectionPool.getConnection((err, conn) => {
        if (err) {
          reject(err);
        }
        conn.query(sql, args, function (err, resu) {
          if (err) {
            reject(err);
          }

          if (resu && resu.length) {
            const fields = EntityMap.get(Class.name) as Map<string, string>;
            // mapper orm
            const data = resu.map((item) => {
              const toObjFields = [...fields.entries()].reduce(
                (obj, [key, value]) => ((obj[key] = value), obj),
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
}

export { TarsusOrm };
