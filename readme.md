<h2 align="center">TARSUS-NODE</h2>

<p align="center">基于 TypeScript 和 Express 的 HttpServer 库，提供了一系列基础功能，包括 Router、DTO、Validate、Pipe、Interceptor 等。</p>

<p align="center"><b>同时该库还包括了 Tarssu-RPC 的 Client && Server 端。该库的设计目标是为开发者提供一套解决方案，可以应用于单体 HTTP 服务，也适用于多个微服务。
</b></p>

# 目录

- [目录](#目录)
  - [快速入门](#快速入门)
  - [Http](#http)
    - [快速启动](#快速启动)
    - [路由](#路由)
    - [管道](#管道)
    - [拦截器](#拦截器)
  - [MicroService](#microservice)
    - [快速启动](#快速启动-1)
    - [协议](#协议)
    - [注册接口](#注册接口)
    - [远程调用](#远程调用)
  - [其他](#其他)
    - [定时器](#定时器)
    - [配置](#配置)
  - [维护者](#维护者)

## 快速入门

// TODO

## Http

### 快速启动

先看代码

````ts
import TarsusHttpApplication from "../../../lib/decorator/app/http";
import {LoadController, LoadInit, LoadServer, LoadStruct, LoadTaro} from "../../../lib/main_control/load_server/load_web_app";
import UserController from "./controller/UserController";
import ValidateController from "./controller/ValidateControrller";

@TarsusHttpApplication
class HttpServer{
    static main(){
        LoadController([UserController,ValidateController])
        // init
        LoadInit((app)=>{
            console.log("hello world")
        });
        LoadStruct()
        LoadTaro()
        // load
        LoadServer({
            load_ms:false
        })
    }
}

HttpServer.main()
````

下面是对上述代码段的解释，用 README 文件的形式来说明它是什么以及如何工作的：

---

这是一个 TypeScript 项目中的 HTTP 服务器应用示例，使用了 Tarsus 框架。下面将逐步解释代码的关键部分。

```ts
import TarsusHttpApplication from "../../../lib/decorator/app/http";
import {LoadController, LoadInit, LoadServer, LoadStruct, LoadTaro} from "../../../lib/main_control/load_server/load_web_app";
import UserController from "./controller/UserController";
import ValidateController from "./controller/ValidateControrller";
```

- 首先，我们导入了所需的依赖项，包括 Tarsus 框架中的装饰器、函数和一些自定义的控制器。

```ts
@TarsusHttpApplication
class HttpServer {
```

- 紧接着，我们定义了一个名为 `HttpServer` 的类，并使用装饰器 `@TarsusHttpApplication` 来将这个类标记为 Tarsus HTTP 应用程序。

```ts
static main() {
```

- 在类中，我们定义了一个名为 `main` 的静态方法。这个方法将作为应用程序的入口点。

```ts
LoadController([UserController, ValidateController])
```

- `LoadController` 函数用于加载控制器，这里传入了 `UserController` 和 `ValidateController`，它们将用于处理 HTTP 请求。

```ts
LoadInit((app) => {
    console.log("hello world")
});
```

- `LoadInit` 函数用于初始化应用程序，这里我们简单地打印 "hello world"，你可以在这里执行应用程序的初始化操作。

```ts
LoadStruct()
LoadTaro()
```

- 接下来，我们调用 `LoadStruct` 和 `LoadTaro` 函数，这些函数用于加载后续微服务的结构体和相关的类。

```ts
LoadServer({
    load_ms: false 
})
```

- 最后，我们调用 `LoadServer` 函数，启动 HTTP 服务器。这里传入了一个配置对象，`load_ms` 设置为 `false`，可能是用来控制是否加载微服务。

```ts
HttpServer.main()
```

- 最后，我们调用 `main` 方法来启动整个应用程序。

---

这段代码展示了一个使用 Tarsus 框架的简单 HTTP 服务器应用程序，其中包括加载控制器、初始化应用程序和启动服务器等步骤。你可以根据你的需求自定义控制器和初始化操作。

### 路由

````ts
import {Controller, Get, INVOKE, Post} from "../../../../lib/decorator/http/router";
import {Limit, limitType} from "../../../../lib/decorator/interceptor/Limit";
import Ret from '../utils/ret'
import { $Transmit } from "../../../../lib/main_control/proto_base";
@Controller("/user")
class UserController {

    @Get("/list")
    getUserList(req) {
        return Ret.success("hello world")
    }

    @INVOKE("/invoke")
    invoke(req,res){
        debugger;
        $Transmit(req,res);
    }

    @Get("/limit_test")
    @Limit(limitType.ROUTER,2,10000) // 10秒内2次最大限制 单个路由
    async limitTest(){
        return {
            code:0,
            message:"success"
        }
    }

    @Post("/ip_limit_test")
    @Limit(limitType.IP,2,10000) // 10秒内2次最大限制
    async IpLimitTest(){
        return {
            code:0,
            message:"success"
        }
    }
}

export default UserController;
````

以下是对上述代码的进一步解释：

```ts
import { Controller, Get, INVOKE, Post } from "../../../../lib/decorator/http/router";
import { Limit, limitType } from "../../../../lib/decorator/interceptor/Limit";
import Ret from '../utils/ret'
import { $Transmit } from "../../../../lib/main_control/proto_base";
```

- 在这一部分，我们导入了一些依赖项。具体包括 Tarsus 框架中的装饰器和拦截器，还有一些自定义的实用工具。

```ts
@Controller("/user")
class UserController {
```

- 接下来，我们定义了一个名为 `UserController` 的类，并使用 `@Controller("/user")` 装饰器来将这个类标记为一个控制器，该控制器将处理与 "/user" 路径相关的 HTTP 请求。

```ts
@Get("/list")
getUserList(req) {
    return Ret.success("hello world")
}
```

- 在 `UserController` 类中，我们定义了一个名为 `getUserList` 的方法，使用 `@Get("/list")` 装饰器来指定这个方法处理 GET 请求，并且与 "/list" 路径相关。在这个方法中，它返回一个成功响应，内容为 "hello world"。

```ts
@INVOKE("/invoke")
invoke(req, res) {
    $Transmit(req, res);
}
```

- `invoke` 方法使用 `@INVOKE("/invoke")` 装饰器，这个接口与微服务有关，我们后续再接受。在方法内部调用 `$Transmit` 函数来处理请求和响应。

```ts
@Get("/limit_test")
@Limit(limitType.ROUTER, 2, 10000) // 10秒内2次最大限制 单个路由
async limitTest() {
    return {
        code: 0,
        message: "success"
    }
}
```

- `limitTest` 方法使用了 `@Get("/limit_test")` 装饰器，表示它处理 GET 请求，并且与 "/limit_test" 路径相关。此外，它还使用了 `@Limit(limitType.ROUTER, 2, 10000)` 装饰器，这表示对于单个路由，它设置了一个限制，即在 10 秒内最多允许 2 次请求。该方法返回一个包含 code 和 message 的对象，表示成功响应。

```ts
@Post("/ip_limit_test")
@Limit(limitType.IP, 2, 10000) // 10秒内2次最大限制
async IpLimitTest() {
    return {
        code: 0,
        message: "success"
    }
}
```

- `IpLimitTest` 方法使用了 `@Post("/ip_limit_test")` 装饰器，表示它处理 POST 请求，并且与 "/ip_limit_test" 路径相关。它也使用了 `@Limit(limitType.IP, 2, 10000)` 装饰器，这表示在 10 秒内最多允许 2 次 IP 地址相关的请求。该方法同样返回一个包含 code 和 message 的对象，表示成功响应。

### 管道

````ts
// ValidateController.ts
import { Request } from "express";
import { Controller, Post } from "../../../../lib/decorator/http/router";
import { UsePipe } from "../../../../lib/decorator/http/pipe";
import { TestValidatePipe } from "../pipe/ValidatePipe";

@Controller("validate")
class ValidateController {
    @Post("list")
    @UsePipe(new TestValidatePipe())
    getList(req:Request){
        const body = req.body;
        return body;
    }
}


export default ValidateController
````

````ts
// ValidatePipe.ts
import { Request } from 'express';
import {TarsusPipe} from '../../../../lib/decorator/http/pipe';
import {TarsusValidate, plainToInstance} from '../../../../lib/decorator/interceptor/Validate';
import UserValidateObj from '../dto/User';
import { PipeError } from '../../../../lib/decorator/http/error';

class TestValidatePipe implements TarsusPipe{
    handle(req:Request){
        try{
            req.body = plainToInstance(req.body,UserValidateObj)
            const check = TarsusValidate(req.body)
            console.log(check);
            if(!check){
                throw PipeError();
            }
        }catch(e){
            return e
        }
    }
}

export {
    TestValidatePipe
}
````

````ts
// User.ts
import { DataTransferOBJ, IsNumber, IsString, MinLen, MaxLen } from "../../../../lib/decorator/interceptor/Validate";

@DataTransferOBJ()
class UserValidateObj{
    @IsNumber()
    age:number;

    @IsString()
    @MinLen(1)
    @MaxLen(10)
    name:string;
}

export default UserValidateObj
````

以下是关于管道（`TestValidatePipe`）如何校验参数的详细解释：

在 `ValidatePipe.ts` 文件中，`TestValidatePipe` 类实现了 `TarsusPipe` 接口，这是 Tarsus 框架中用于自定义请求数据验证和处理的关键部分。

在 `handle` 方法中，`TestValidatePipe` 对请求进行以下操作：

1. **转换请求数据：** 首先，它尝试将请求体数据（`req.body`）转换为一个具体的对象，这个对象是 `UserValidateObj` 类的实例。这是通过以下代码实现的：

   ```ts
   req.body = plainToInstance(req.body, UserValidateObj)
   ```

   这一行代码使用 `plainToInstance` 函数，将请求体数据转换为 `UserValidateObj` 对象。这是数据传输对象（DTO），用于定义预期的数据结构。

2. **数据验证：** 一旦数据转换完成，它使用以下代码进行数据验证：

   ```ts
   const check = TarsusValidate(req.body)
   ```

   这一行代码调用了 `TarsusValidate` 函数，对请求体数据进行验证。在验证过程中，框架会根据 `UserValidateObj` 类中的装饰器规则（如 `@IsNumber()`、`@IsString()`、`@MinLen(1)`、`@MaxLen(10)`）来检查请求数据是否满足这些规则。如果数据验证失败，将返回 `false`，否则将返回 `true`。

3. **处理验证结果：** 最后，它检查验证的结果 `check`，如果验证失败（即 `check` 为 `false`），则抛出一个自定义的错误，可能是 `PipeError`。

整个过程是一个自定义的请求数据验证和处理管道。如果请求数据不满足定义的规则，这个管道将阻止请求继续处理，并可能返回一个错误响应。这有助于确保请求数据的有效性和一致性。

### 拦截器

## MicroService

### 快速启动

### 协议

在进行远程函数调用时，我们首先需要确定相互之间调用的参数，返回的数据结构，调用的接口等。为此，我们需要先定义其协议。
协议命名为taro, 代表 tarsus-object.该协议兼容 java,nodejs。

开发该协议的步骤

1. 定义数据结构：首先，需要按照协议定义的数据结构来创建相关的类和结构。在这个示例中，需要创建 Basic、User、GetUserByIdReq、GetUserByIdRes、GetUserListReq 和 GetUserListRes 类。

2. 生成对应的协议文件：使用命令 taro to ts || java ./xxx.taro

3. 实现接口：在生成协议文件以后，同时会看到对应的协议接口，根据接口定义，实现 TaroInterFace 接口中的方法，即 getUserById 和 getUserList。这些方法应该执行与协议规定的数据交换操作。

4. 客户端和服务器实现：通常，协议将在客户端和服务器之间用于通信。因此，需要在客户端和服务器上实现协议的数据解析和构建逻辑。客户端将使用协议发送请求，服务器将解析请求并生成响应。

5. 数据交换：客户端和服务器将使用协议定义的数据结构来构建请求和响应对象，并进行数据的序列化和反序列化，以确保数据正确传递。

6. 测试和验证：在实现协议之后，需要进行测试和验证，以确保客户端和服务器能够按照协议进行正确的通信。

完整的协议代码如下

````c
// TaroUser  Created By leemulus 2023.3.21
// before cmd  taro to ts ./TaroUser.taro 

struct CommParams  {

    Basic               :   {
        1   token       :   string;
    };

    User                :   {
        1   id          :   string;
        2   name        :   string;
        3   age         :   string;
        4   fullName    :   string;
        5   address     :   string;
    };

    GetUserByIdReq      :   {
        1   id          :   int;
        2   basic       :   Basic;
    };

    GetUserByIdRes      :   {
        1   code        :   int;
        2   data        :   User;
        3   message     :   string;
    };

    GetUserListReq      :   {
        1   basic       :   Basic;
        2   ids         :   List<int>;
    };

    GetUserListRes      :   {
        1   code        :   int;
        2   data        :   List<User>;
        3   message     :   string;
    };

};


// 用户接口
interface TaroInterFace  {
    int getUserById(Request : GetUserByIdReq, Response : GetUserByIdRes);
    int getUserList(Request : GetUserListReq, Response : GetUserListRes);
};
````

生成后的代码如下

````ts
// after cmd taro to ts ./TaroUser.taro 
const { TarsusReadStream } = require("tarsus-cli/taro");
export class Basic {
  public token: string;
  constructor(...args: any[]) {
    const _TarsusReadStream = new TarsusReadStream("Basic", args);
    this.token = _TarsusReadStream.read_string(1);
  }
}
export class User {
  public id: string;
  public name: string;
  public age: string;
  public fullName: string;
  public address: string;
  constructor(...args: any[]) {
    const _TarsusReadStream = new TarsusReadStream("User", args);
    this.id = _TarsusReadStream.read_string(1);
    this.name = _TarsusReadStream.read_string(2);
    this.age = _TarsusReadStream.read_string(3);
    this.fullName = _TarsusReadStream.read_string(4);
    this.address = _TarsusReadStream.read_string(5);
  }
}
export class GetUserByIdReq {
  public id: number;
  public basic: Basic;
  constructor(...args: any[]) {
    const _TarsusReadStream = new TarsusReadStream("GetUserByIdReq", args);
    this.id = _TarsusReadStream.read_int(1);
    this.basic = _TarsusReadStream.read_struct(2, "Basic");
  }
}
export class GetUserByIdRes {
  public code: number;
  public data: User;
  public message: string;
  constructor(...args: any[]) {
    const _TarsusReadStream = new TarsusReadStream("GetUserByIdRes", args);
    this.code = _TarsusReadStream.read_int(1);
    this.data = _TarsusReadStream.read_struct(2, "User");
    this.message = _TarsusReadStream.read_string(3);
  }
}
export class GetUserListReq {
  public basic: Basic;
  public ids: Array<number>;
  constructor(...args: any[]) {
    const _TarsusReadStream = new TarsusReadStream("GetUserListReq", args);
    this.basic = _TarsusReadStream.read_struct(1, "Basic");
    this.ids = _TarsusReadStream.read_list(2, "List<int>");
  }
}
export class GetUserListRes {
  public code: number;
  public data: Array<User>;
  public message: string;
  constructor(...args: any[]) {
    const _TarsusReadStream = new TarsusReadStream("GetUserListRes", args);
    this.code = _TarsusReadStream.read_int(1);
    this.data = _TarsusReadStream.read_list(2, "List<User>");
    this.message = _TarsusReadStream.read_string(3);
  }
}
````

### 注册接口

我们希望微服务后台能像注册HTTP路由一样快速的注册接口，屏蔽底层的实现。为此，Tarsus提供了一系列的方法来支持这一点。
同样的，在上面的协议文件里面，执行 taro inf ts ./TaroUser.taro后，
会得到如下接口，一切看起来都像提前定义好了。

````ts
interface TaroInterFace {
  getUserById(
    Request: GetUserByIdReq,
    Response: GetUserByIdRes
  ): Promise<GetUserByIdRes>;
  getUserList(
    Request: GetUserListReq,
    Response: GetUserListRes
  ): Promise<GetUserListRes>;
}
````

我们只需要手动实现这些接口即可。
此外，我们还需要手动对这些类，接口进行注解定义，这看起来有些复杂，但是在熟练的使用后会发现一切都是那么自然。

**@TarsusInterFace**用来注册RPC接口前缀。
**@TarsusMethod**用来注册RPC接口方法。
**@Stream("Request", "Response")**用来注册序列化的请求和响应。

````ts
@TarsusInterFace("TaroInterFaceTest")
class TaroInterFaceImpl implements TaroInterFace {
    @TarsusMethod
    @Stream("GetUserByIdReq", "GetUserByIdRes")
    getUserById(
        Request: GetUserByIdReq,
        Response: GetUserByIdRes
    ): Promise<GetUserByIdRes> {
        return new Promise((resolve, reject) => {
            Response.code = 0;
            Response.data = {
                address: "1",
                age: "11",
                id: "11",
                fullName: "11",
                name: "11",
            };
            Response.message = Request.basic.token;
            resolve(Response);
        });
    }

    @TarsusMethod
    @Stream("GetUserListReq", "GetUserListRes")
    getUserList(
        Request: GetUserListReq,
        Response: GetUserListRes
    ): Promise<GetUserListRes> {
        return new Promise((resolve, reject) => {
            Response.code = 0;
            Response.data = Request.ids.map(el => {
                let user = new User()
                user.address = el + "address";
                user.id = el + "id";
                user.fullName = el + "fullName";
                user.name = el + "name";
                user.age = el + "age";
                return user;
            })
            Response.message = Request.basic.token;
            resolve(Response);
        });
    }
}
````

### 远程调用

还记得**路由**部分讲的 **INVOKE** 和 **$Transmit** 吗？
他们作为一个网关，用来执行远程调用微服务的接口方法,如下，是调用一个RPC方法所需要的参数
当然我们不建议这么做，因为这样会有安全问题。我们可以注册对应的client端的路由，然后一个一个注册对应的方法。
避免所有参数都是明文参数。

````json
{
    "interFace": "TaroInterFaceTest",
    "method": "getUserById",
    "data": {
        "id":"1",
        "basic":{
            "token":"testToken"
        }
    },
    "proxy":"NodeServer",
    "timeout": "60000",
    "request":"GetUserByIdReq"
}

````

## 其他

### 定时器

很多情况下我们需要定时器去计算一些数据，Tarsus封装了一些定时任务的装饰器。
具体用法如下:

````typescript
@Schedule
class ScheduleServer {
    public userMap: UserMap = {}
    public wordMap :WordMap = {}
    public userSql = 'select * from users'
    public wordSql = 'select en_name as en_word,own_mark,user_id from words '
    @Cron("*/20 * * * *", true)
    public async UserCacheMethod() {
        const conn = await $PoolConn();
        const that = this;
        conn.query(that.userSql, function (_, resu) {
            if (!resu.length) {
                return
            }
            delete that.userMap;
            console.log("START-----------开始同步用户表", moment().format("YYYY-MM-DD"))
            that.userMap = lodash.keyBy(resu, "id")
            console.log('同步数据',JSON.stringify(that.userMap))
            console.log('同步数据',resu.length,"条")
            console.log("END-----------同步用户表结束", moment().format("YYYY-MM-DD"))

        })
    }
    @Cron("*/30 * * * *", false)
    public async WordCacheMethod() {
        const conn = await $PoolConn();
        const that = this;
        conn.query(that.wordSql, function (_, resu) {
            console.log('resu',resu);
            
            if (!resu.length) {
                return
            }
            delete that.wordMap;
            console.log("START-----------开始同步单词表", moment().format("YYYY-MM-DD"))
            const ret  = resu.map(item=>{
                item.user_name = that.userMap[item.user_id].username
                return item;
            })
            that.wordMap = lodash.keyBy(ret, "id")
            console.log('同步数据',JSON.stringify(that.wordMap))
            console.log('同步数据',resu.length,"条")
            console.log("END-----------同步单词表结束", moment().format("YYYY-MM-DD"))
        })
    }
}
````

### 配置

提供两套配置，仅供参考

````javascript
// HttpClient 或者 RPC-Client端的配置
// 当纯作为http服务时，servant可以不需要
// 同时 load_Server 的 ms 配置也需要设置为 false
// server.project 为该服务的配置，用来定义 服务组/服务名 -l 语言 node java可选 @tarsus/协议 http ms 可选 -h ip地址 -p 端口地址
// server.servant 为网关层所需要的后台微服务的地址，写法与上面一致。
// server.database 不多做介绍
module.exports = {
    server: {
        project: "@TarsusDemoProject/NodeProxyDemo -l node -t @tarsus/http -h 127.0.0.1 -p 12011",
        servant: [
            "@TarsusDemoProject/NodeServer -l node -t @tarsus/ms -h 127.0.0.1 -p 12012 -w 10",
            '@TarsusDemoProject/JavaServer -l java -t @tarsus/ms -h 127.0.0.1 -p 12013 -w 10'
        ],
        database: {
            default: true,
            type: "mysql",
            host: "localhost",
            username: "root",
            password: "123456",
            database: "test_db", //所用数据库
            port: 3306,
            connectionLimit: 10,
        },
    },
};
````

````javascript
// RPC-Server端的配置
module.exports = {
    server: {
        project: "@TarsusDemoProject/NodeServer -l node -t @tarsus/ms -h 127.0.0.1 -p 12012",
        database: {
            default: true,
            type: "mysql",
            host: "localhost",
            username: "root",
            password: "123456",
            database: "test_db", //所用数据库
            port: 3306,
            connectionLimit: 10,
        },
    },
};
````

## 维护者

<table>
    <tbody>
        <tr>
            <td>
                <a target="_blank" href="https://github.com/chelizichen"><img width="60px" src="https://avatars.githubusercontent.com/u/86051766?v=4"></a>
            </td>
        </tr>
    </tbody>
</table>

