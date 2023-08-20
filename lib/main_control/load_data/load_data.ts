import * as mysql from "mysql";
// import {createClient} from "../__test_web__/node_modules/redis";

const load_data = {
    init: async function (config: Record<string, any>) {
        const {host, user, password, database, port, connectionLimit} = config;
        console.log('*********** database config ***********');
        console.log(config);
        const pool = await mysql.createPool({host, user, database, port, password, connectionLimit});
        load_data.pool = pool
        console.log(load_data.pool);
        console.log('*********** database config ***********');
        // load_data.rds = createClient();
        // load_data.rds.connect();
    },
    pool: <mysql.Pool> void "database connection",
    rds:void "redis connection"

}

export default load_data