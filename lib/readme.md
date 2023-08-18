# 2023.8.11 重构部分逻辑

由于大量使用Class，且无法控制成员变量，所以将采取统一对象 + 函数的形式

## 8.18 Error

统一工具类、代理类、实例的入口，避免多次新建实例增加开销

## 8.18 完成联调

````json
{
    "interFace": "TaroInterFaceTest",
    "method": "getUserById",
    "data": {
        "id":"1"
    },
    "proxy":"NodeServer",
    "timeout": "60000",
    "request":"GetUserByIdReq"
}
````


## 8.18 多进程

`````ts
 if (cluster.isWorker) {
    const __tarsus_port__ = process.env.__tarsus_port__;
    // console.log(`子进程环境变量`,process.env);
    const toMasterMessage = JSON.stringify({
        port: __tarsus_port__,
        pid: process.pid,
    });

    process.send(toMasterMessage);

    console.log(`子进程已开启 ----- PID ${process.pid}`);
    app.listen(__tarsus_port__, function () {
        console.log("Server started at port:", __tarsus_port__);
        // 监听
    });
} else {
    console.log(`主进程已开启 ———— PID: ${process.pid}`);
    for (let i = 0; i < ports.length; i++) {
        const forker = cluster.fork({
            __tarsus_port__: ports[i],
        });

        forker.on("message", function (message) {
            if (typeof message == "string") {
                const data = JSON.parse(message as string);
                console.log(data);
            }
        });
        // 监听工作进程的退出事件
        forker.on("exit", (worker, code, signal) => {
            // console.log(`Worker process ${worker.process.pid} exited`);
            // @ts-ignore
            console.log(`Starting a new worker...`);
            cluster.fork({
                __tarsus_port__: ports[i],
            });
        });
    }
}
`````
