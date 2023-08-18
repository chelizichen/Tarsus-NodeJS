import * as mysql from "mysql";
// import {createClient} from "../__test_web__/node_modules/redis";

const load_data = {
    init: async function (config: Record<string, any>) {
        const {host, user, password, database, port, connectionLimit} = config;
        const pool = await mysql.createPool({host, user, database, port, password, connectionLimit});
        load_data.pool = pool

        // load_data.rds = createClient();
        // load_data.rds.connect();
    },
    pool: void "database connection",
    rds:void "redis connection"

}

export default load_data