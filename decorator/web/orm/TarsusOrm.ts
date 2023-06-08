import * as mysql from "mysql";
import _ from "lodash";
import { __column__ } from "./Entity";
import {OrmMethods, Pagination} from './Repo';
import { SQLTools } from "./Tools";
import { TarsusEntitys } from "./Entity";
const PrepareToQuery = Symbol.for('PrepareToQuery')

/**
 * @description Tarsus ORM 对象与实体映射类
 * @type {OrmMethods}
 */
class TarsusOrm<T = any> implements OrmMethods<T> {
  /**
   * @description 重载getList
   */
  async getList(pagination?: Pagination): Promise<T[]>;
  async getList(
    options?: Record<string, any>,
    pagination?: Pagination
  ): Promise<T[]>;
  async getList(options?: unknown, pagination?: unknown): Promise<T[]> {
    // @ts-ignore
    const sql = new SQLTools(TarsusEntitys[this.constructor.prototype]);
    if (options) {
      // 单纯走分页
      if (options instanceof Pagination) {
        const _sql_ = sql.pagination(options).getSQL();
        console.log('_sql_',_sql_);

        const data = await this[PrepareToQuery]<T[]>(_sql_);
        return data;
      } // 如果走有参数的
      else if (typeof options == "object" && options != null) {
        sql.buildWhere(options);
        // 如果有分页参数
        if (pagination instanceof Pagination) {
          console.log(sql);
          const _sql_ = sql.pagination(options).getSQL();
          const data = await this[PrepareToQuery]<T[]>(_sql_);
          return data;
        } // 走无分页参数
        else {
          const _sql_ = sql.getSQL();
          const data = await this[PrepareToQuery]<T[]>(_sql_);
          return data;
        }
      }
    } // 直接走无参拿所有
    else {
      return null;
    }
  }
  async findOne(id: string | number): Promise<T> {
    const sql = new SQLTools(this.constructor.prototype)
    id = String(id)
    const _sql_ = sql.buildWhere({id}).getSQL();
    const data = this[PrepareToQuery]<T>(_sql_);
    if(data && data instanceof  Array && data.length){
      return data[0];
    }else {
      return null;
    }
  }
  async delOne(id: string | number): Promise<any> {
    const sql = new SQLTools(this.constructor.prototype);
    const data = await this[PrepareToQuery](sql);
    return data
  }
  save(entity: T): void {
    throw new Error("Method not implemented.");
  }
  update(entity: T): void {
    throw new Error("Method not implemented.");
  }

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

  async query(sql: string, args: any[] = []): Promise<any> {
    const vm = TarsusOrm;
    const tgvm = this.constructor.prototype;

    return new Promise(async (resolve, reject) => {
      vm.connectionPool.getConnection((err, conn) => {
        if (err) {
          reject(err);
        }
        console.log(sql, args);

        conn.query(sql, args, function (err, resu) {
          if (err) {
            reject(err);
          }
          if (resu && resu.length) {
            // const fields = EntityMap.get(targetEntity.name) as Map<string, string>;
            const __columns__ = tgvm.__columns__;

            // mapper orm
            const data = resu.map((item) => {
              const __item__ = {};
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

  async [PrepareToQuery]<T>(sql: string, args: any[] = []): Promise<T> {
    const vm = TarsusOrm;
    const that = this;
    return new Promise(async (resolve, reject) => {
      vm.connectionPool.getConnection((err, conn) => {
        if (err) {
          reject(err);
        }
        // 对数据做关联处理
        console.log(sql);
        
        conn.query(sql, args, async function (err, resu) {
          if (err) {
            reject(err);
          }

          // // @ts-ignore
          // if(that.__reference__){

          // }

          // const data = resu.map(item=>{

          //   // @ts-ignore
          //     if(that.__reference__){
          //       // @ts-ignore
          //     for(let v in that.__reference__){
          //       console.log(v)
          //       // @ts-ignore
          //       console.log(that.__reference__[v])
          //     }
          //   }
          //   return item
          // })
          resolve(resu);
        });
      });
    });
  }

    del(options: Record<string, string | number>) {
    }

  // static async queryTest(sql:string){
  //   const data = await ArcOrm.ConnectionPool.query(sql);
  //   return data;
  // }
}

export { TarsusOrm };
