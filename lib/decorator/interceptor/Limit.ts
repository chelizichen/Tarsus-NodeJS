import { CronJob } from "cron";
import load_data from "../../main_control/load_data/load_data";
import { Request, Response } from "express";
import { LimitError } from '../http/error'
type router = string;
type ip = string;
type limitNum = number; // 限制请求数量
type limitPeriod = string | number; // 限制期限

const limitType = {
    IP: "ip", // 限制IP
    ROUTER: "router", // 全局限制 在初始化时会在内存里面 set 一个全局变量
    RdsKey: "rdskey", // rds-key 做限制
};

const IpConainer:Record<router,Record<ip,limitNum>> = {}

const LimitContainer = {
    keys: {},
    interval_keys: {},
    keys_max_num: {},
    keys_type: {},
    async reset_key(key: string) {
        const key_type = LimitContainer.keys_type[key];
        if (key_type == limitType.RdsKey) {
            await load_data.rds.set(key,0);
        }else if(key_type == limitType.IP){
            const ipRecords = IpConainer[key]; // 拿到该IP
            for(let v in ipRecords){
                console.log('自动清除ip',v);
                ipRecords[v] = 0
            }
        }else{
            LimitContainer.keys[key] = 0;
        }
    },
    set_key(keytype: any, key: string, limitNum: limitNum, period: limitPeriod) {
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
        if(keytype === limitType.IP){
            IpConainer[key] = {}
        }
    },
    async add_key(key: string,context?:[Request,Response]): Promise<void> {
        const max_num = LimitContainer.keys_max_num[key];
        const key_type = LimitContainer.keys_type[key];
        if (key_type == limitType.ROUTER) {
            const curr = LimitContainer.keys[key];
            if (curr >= max_num) throw LimitError();
            LimitContainer.keys[key] = curr + 1;
        }
        if(key_type == limitType.IP){
            const [req] = context;
            let ipRecord = IpConainer[key][req.ip]
            if(!ipRecord){
                IpConainer[key][req.ip] = 1;
            }
            if(ipRecord > max_num) throw LimitError();
            IpConainer[key][req.ip] ++;
        }
        if (key_type == limitType.RdsKey) {
            const curr = await load_data.rds.get(key);
            if (curr >= max_num) throw LimitError()
            load_data.rds.incr(key);
        }
    },
};


const Limit = (
    type: typeof limitType | string,
    num: limitNum,
    period: limitPeriod
) => {
    return function (value: any, context: ClassMethodDecoratorContext) {
        let key = "";
        if (type === limitType.ROUTER) {
            key = context.name as string;
            LimitContainer.set_key(limitType.ROUTER, key, num, period);
        } else if (type === limitType.IP) {
            key = context.name as string;
            // 每个IP请求该接口每秒最大多少次
            LimitContainer.set_key(limitType.IP, key, num, period);
        } else {
            // @ts-ignore
            key = type;
            LimitContainer.set_key(limitType.RdsKey, key, num, period);
        }
        console.log('注册节流任务',type,key,num,period);
        async function limit_interceptor_fn<This = unknown>(
            this: This,
            ...args: any[]
        ) {
            try{
                // @ts-ignore
                await LimitContainer.add_key(key,args);
                let data = value.call(this, ...args);
                return data;
            }catch(e){
                return e;
            }
        }
        return limit_interceptor_fn
    };
};

export { Limit,limitType };
