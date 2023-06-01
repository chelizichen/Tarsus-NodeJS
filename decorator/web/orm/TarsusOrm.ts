import * as mysql from "mysql";
import _ from "lodash";
import { __column__ } from "./Entity";

/**
 * @description Tarsus ORM 对象与实体映射类
 */
class TarsusOrm {
  static getConnection() {}
  static connectionPool: mysql.Pool;

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
            TarsusOrm.connectionPool = pool;
          }
        });
      }
    }
  }

  async query(sql: string, args: any[] , targetEntity: any): Promise<any> {
    const vm = TarsusOrm;
    const tgvm = targetEntity.prototype;

    return new Promise(async (resolve, reject) => {
      vm.connectionPool.getConnection((err, conn) => {
        if (err) {
          reject(err);
        }
        conn.query(sql, args, function (err, resu) {
          if (err) {
            reject(err);
          }

          if (resu && resu.length) {
            // const fields = EntityMap.get(targetEntity.name) as Map<string, string>;
            const __columns__ = tgvm.__columns__;
            
            // mapper orm
            const data = resu.map((item) => {
              const __item__ = {}
              for (let v in __columns__) {
                let { column_name } = __columns__[v];
                __item__[column_name] = item[v];
              }
              return __item__;
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
