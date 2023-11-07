import { RedisClientType, createClient } from "redis";
import knex from "knex";

const load_data = {
    init: async function (config: Record<string, any>) {
        const { host, username:user, password, database, port } = config;
        console.log('*********** database config ***********', JSON.stringify(config));
        const pool = await knex({
            client: 'mysql2',
            connection: { 
                host, 
                user, 
                database, 
                port, 
                password 
            },
        });
        load_data.pool = pool
        console.log('*********** database config ***********');
        load_data.rds = createClient();
        load_data.rds.connect();
    },
    pool: <knex.Knex>void "database connection",
    rds: <RedisClientType>void "redis connection"

}

export default load_data