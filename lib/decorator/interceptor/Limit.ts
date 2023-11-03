import { CronJob } from "cron";
import load_data from "../../main_control/load_data/load_data";

const LimitContainer = {
    keys: {},
    interval_keys: {},
    keys_max_num: {},
    keys_type: {},
    async reset_key(key: string) {
        const key_type = LimitContainer.keys_type[key];
        if (key_type == limit_type.RdsKey) {
            await load_data.rds.set(key,0);
        }else{
            LimitContainer.keys[key] = 0;
        }
    },
    setKey(keytype: any, key: string, limitNum: limitNum, period: limitPeriod) {
        LimitContainer.keys[key] = 0;
        if (typeof period == "number") {
            LimitContainer.interval_keys[key] = setInterval(() => {
                LimitContainer.reset_key(key);
            }, period);
        } else {
            const value = () => {
                LimitContainer.reset_key(key);
            };
            const cronConfig = {
                onTick: value,
                runOnInit: true,
                start: true,
                timeZone: "Asia/Shanghai",
                cronTime: period,
            };
            LimitContainer.interval_keys[key] = new CronJob(cronConfig);
        }
        LimitContainer.keys_max_num[key] = limitNum;
        LimitContainer.keys_type[key] = keytype;
    },
    async addKey(key: string): Promise<boolean> {
        const max_num = LimitContainer.keys_max_num[key];
        const key_type = LimitContainer.keys_type[key];
        if (key_type == limit_type.ALL) {
            const curr = LimitContainer.keys[key];
            if (curr >= max_num) {
                return false;
            }
            LimitContainer.keys[key] = curr + 1;
            return true;
        }
        if (key_type == limit_type.RdsKey) {
            const curr = await load_data.rds.get(key);
            if (curr >= max_num) {
                return false;
            }
            load_data.rds.incr(key);
            return true;
        }
        return true;
    },
};

const limit_type = {
    IP: "ip", // 限制IP
    ALL: "all", // 全局限制 在初始化时会在内存里面 set 一个全局变量
    RdsKey: "rdskey", // rds-key 做限制
};

// 限制请求数量
type limitNum = number;

// 限制期限
type limitPeriod = string | number;

const Limit = (
    type: typeof limit_type | string,
    num: limitNum,
    period: limitPeriod
) => {
    return function (value: any, context: ClassMethodDecoratorContext) {
        let key = "";
        if (type === limit_type.ALL) {
            key = context.name as string;
            LimitContainer.setKey(limit_type.ALL, key, num, period);
        } else if (type === limit_type.IP) {
            key = context.name as string;
            LimitContainer.setKey(limit_type.IP, key, num, period);
        } else {
            // @ts-ignore
            key = type;
            LimitContainer.setKey(limit_type.RdsKey, key, num, period);
        }
        async function limit_interceptor_fn<This = unknown>(
            this: This,
            ...args: any[]
        ) {
            const add_succ = await LimitContainer.addKey(key);
            if (add_succ) {
                return { code: -9, message: "请求达到最大限制" };
            } else {
                let data = value.call(this, ...args);
                return data;
            }
        }
        return limit_interceptor_fn
    };
};

export { Limit,limit_type };
