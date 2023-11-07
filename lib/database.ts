import knex from "knex";
import load_data from "./main_control/load_data/load_data";

let pool = void 'knex mysql client' as knex.Knex
setImmediate(()=>{
    pool = load_data.pool
})


// async function $PoolConn() :Promise<mysql.PoolConnection>{
//     return new Promise((resolve, reject) => {
//         pool.getConnection((err, conn) => {
//             if (err) {
//                 reject(err)
//             }
//             resolve(conn)
//         })
//     })
// }

// async function $Query(sql, params) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const conn = await $PoolConn() as mysql.PoolConnection
//             conn.query(sql, params, function (err, res) {
//                 if (err) {
//                     reject(err)
//                 }
//                 resolve(res)
//             })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

function LoadDataBase(data: Record<string, any>) {
    load_data.init(data)
}

export {
    pool,
    LoadDataBase,
    // $PoolConn,
    // $Query
}