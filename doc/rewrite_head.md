# Rewrite Head

1. 将事件ID改为8位UID，废弃标识符从0-9999的做法。
2. 添加多个请求头参数，请求起始时间
3. 跨服务调用与代码设计

## 1 UID

let eid = uid(8)

eid + head + body

## 2 请求头
调用链、当前调用时间、调用结束耗时

<interface 接口名>

<method 方法>

<request 请求结构体>

<timeout 超时上报时间>

<timeSpent 花费时间>

<bodyLen 请求体长度>


## 3 跨服务调用

````
@TarsusReflect(proxy,interface)
class ProxyServer{
    A_invoke_method(Request,Response){
        
    }
}
````
