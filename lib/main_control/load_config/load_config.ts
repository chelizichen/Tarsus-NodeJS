import path from "path";

/**
 * @desc getter setter config
 */
const cwd = process.cwd;
// judge is production environment or not

export enum config_enum {
    project = "project",
    database = "database",
    servant = "servant",
    taro="taro"
}

type void_func = (...args: any[]) => void;


/**
 * @template
 * config:{
 *     server:{
 *          // provide database config \n
 *         database:{
 *
 *         },
 *         // provide microservice config
 *         servant:[],
 *         // provide current server config
 *         server:string
 *     }
 * }
 */
type totalConfig = {
    target_config: Record<string, any>
    load_config: void_func,
    get_prod_config: void_func,
    init: void_func
    get_config: (target?: config_enum) => any,
}

const isProd = !!process.env.production;

const load_config: totalConfig = {
    target_config: null,
    load_config: function () {
        let config = void "judge is Prod";
        if (!isProd) {
            let config_path = path.resolve(cwd() , "tarsus.config.js");
            console.log("config_path -- ",config_path)
            config = require(config_path);
        } else {
            config = load_config.get_prod_config()
        }
        // get db --  servant config
        const server_config = config.server;
        // const db_config = server_config.db;
        // const servant_config = server_config.servant;
        load_config.target_config = server_config;
    },

    // todo -- get prod_config by request to http
    get_prod_config: function () {

    },

    get_config(target?: config_enum) {
        if (target) {
            return load_config.target_config[target]
        }
        return load_config.target_config
    },
    init: function () {
        load_config.load_config();
    },
}

export default load_config;