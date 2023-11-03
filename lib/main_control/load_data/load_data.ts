import * as mysql from "mysql";
import { RedisClientType, createClient } from "redis";

const load_data = {
    init: async function (config: Record<string, any>) {
        const {host, user, password, database, port, connectionLimit} = config;
        console.log('*********** database config ***********');
        const pool = await mysql.createPool({host, user, database, port, password, connectionLimit});
        load_data.pool = pool
        console.log('*********** database config ***********');
        load_data.rds = createClient();
        load_data.rds.connect();
    },
    pool: <mysql.Pool> void "database connection",
    rds: <RedisClientType> void "redis connection"

}

export default load_data