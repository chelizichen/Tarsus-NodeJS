<h2 align="center">Rpc Proto</h2>

# 目录

- [目录](#目录)
  - [概念](#概念)
  - [协议文件](#协议文件)
    - [定义](#定义)
    - [生成](#生成)
    - [接口](#接口)
  - [运行](#运行)
  - [内部原理](#内部原理)

## 概念

RPC，全称为远程过程调用（Remote Procedure Call），是一种允许程序调用另一个地址空间（通常是网络上的另一台机器）上的过程（或者子程序）的通信协议。它使得分布式计算系统中的不同程序能够像调用本地函数一样调用远程服务。

以下是 RPC 的一些关键概念和特点：

通信协议： RPC 通常使用特定的通信协议，如 gRPC 使用 HTTP/2 协议，Apache Thrift 使用自定义的二进制协议。这些协议负责序列化和传输数据，确保在客户端和服务器之间进行可靠的通信。

数据序列化： 为了在网络上传输数据，RPC 使用数据序列化将函数参数和返回值转换为字节流。常见的序列化格式包括 Protocol Buffers、JSON、XML 等。

调用： RPC最核心的功能就是相互调用，我们希望调用接口像调用本地函数一样简单。

## 协议文件

和HTTP一样，RPC调用过程中的数据涉及到序列化和反序列化，而数据序列化的过程通常由协议文件定义。

协议文件一般包含多种数据结构，如 Map、List、Set、String、Int8、Int16、Int32、Struct等。

协议文件一般还包含Rpc接口的定义。

### 定义

以调用获取用户列表的接口为例，定义如下结构体。

````c++
module Ample;

struct QueryId      {
    0   int8    id;
    1   BasicInfo basicInfo;
}

struct BasicInfo    {
    0   string  token;
    1   map<string,string>  detail;
}

struct Pagination   {
    0   int16    offset;
    1   int16    size;
    2   string   keyword;
}

struct User   {
    0   int8    id;
    1   string  name;
    2   int8    age;
    3   string  phone;
    4   string  address;  
}

struct getUserListReq  {
    0   BasicInfo     basicInfo;
    1   Pagination    page;
}

struct getUserListRes  {
    0   int8    code;
    1   string  message;
    2   vector<User>  data;
    3   User    user;
}
````

### 生成

通常使用指定的命令编译协议文件可以生成序列化和反序列化的类。

序列化：Serialize，将需要传输的类的实例对象或普通对象转换成二进制数据。

反序列化：Deserialize，将二进制数据“读取”成类的实例对象或普通对象。

上述的QueryId结构体会被编译成如下的TypeScript类

````ts
const QueryId = {
  _t_className: "Struct<QueryId>",
} as JceStruct;

QueryId.Read =
  @DefineStruct(QueryId._t_className)
  class extends T_RStream {
    @DefineField(0) public id;
    @DefineField(1) public basicInfo;

    @Override public Deserialize() {
      this.id = this.ReadInt8(0);
      this.basicInfo = this.ReadStruct(1, BasicInfo.Read);
      return this;
    }
  };

QueryId.Write =
  @DefineStruct(QueryId._t_className)
  class extends T_WStream {
    @Override public Serialize(obj) {
      this.WriteInt8(0, T_Utils.Read2Number(obj, "id"));
      this.WriteStruct(
        1,
        T_Utils.Read2Object(obj, "basicInfo"),
        BasicInfo.Write,
      );
      return this;
    }
  };

````

### 接口

定义数据接口的形式一般也很简单，通常指定传入的参数类型、回包类型即可。

示例如下：

````c++
rpc getUserList(getUserListReq req, getUserListRes res);

rpc getUser(QueryId req, getUserRes res);
````

## 运行

我们分别运行服务端和客户端来进行演示。

## 内部原理

大多数RPC的协议都采用 TLV 的格式
