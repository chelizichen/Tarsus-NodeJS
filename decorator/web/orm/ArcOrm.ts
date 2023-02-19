import * as mysql from "mysql";
// ORM 基类
class ArcOrm {
  static getConnection() {}
  static ConnectionPool: mysql.Pool;

  static  CreatePool(config: any){
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
            ArcOrm.ConnectionPool = pool;
          }
        });
      }
    }
  }

  static async query(prepareSqlAndArgs: any): Promise<any> {
    return new Promise(async (resolve,reject)=>{
      const { sql, args } = prepareSqlAndArgs;
      console.log(prepareSqlAndArgs);
      ArcOrm.ConnectionPool.getConnection((err,conn)=>{
        if(err){
          reject(err)
        }
        conn.query(sql,args,function(err,resu){
          if(err){
            reject(err)
          }
          resolve(resu)
        })
      })

    })

  }
  // static async queryTest(sql:string){
  //   const data = await ArcOrm.ConnectionPool.query(sql);
  //   return data;
  // }
}

export { ArcOrm };
