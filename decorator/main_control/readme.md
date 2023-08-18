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