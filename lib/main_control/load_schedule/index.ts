import {CronJob} from "cron";


let InitMethods = {}

const Cron = (time: string, init: boolean = false) => {
    return function (value, context: ClassMethodDecoratorContext) {
        context.addInitializer(function () {
            value = value.bind(this)
            InitMethods[context.name] = {
                onTick: value,
                runOnInit: value,
                start: true,
                timeZone: "Asia/Shanghai",
                cronTime: time
            }
        })
    }
}

const Schedule = (value: any, context: ClassDecoratorContext) => {
    context.addInitializer(() => {
        setImmediate(() => {
            for (let v in InitMethods) {
                const cron_config = InitMethods[v]
                // 初始化执行
                new CronJob(cron_config)
            }
        })
    })
}

export {
    Cron,Schedule
};