import axios from "axios";

/**
 * @description
 * 发起代理请求
 * [@Tarsus/Java](https://github.com/chelizichen/Tarsus-Java)
 * */
type target = {
  target: string;
  project: string;
};

/**
 * @description 装配参数
 * 可以连续设置 <key,value> ，或者只能设置一个 string value
 *  */
type assemble = string | Record<string, any> | (() => Record<string, any>);

/**
 * @description 
 * const data = await TarsusRequest.create("aaa","bbb").assemble("asd","123").assemble("123","asd")
 * TarsusRequest.send({'project':"",'target':""},data);
 * */
class TarsusRequest {
  // 消息体
  private Body:Record<string,any> = {};
  // 数据
  private Data:Record<string,any> = {};

  // 是否可以继续设置 data 数据 当 assemble 的 key 为 callback ｜ data 时自动设置为false
  // 此时不可以再使用assemble

  private CanSetData = true;

  constructor(interFace: string, method: string) {
    this.Body["interFace"] =  interFace;
    this.Body["method"] = method;
  }

  public static create(interFace: string, method: string) {
    return new TarsusRequest(interFace, method);
  }

  public assemble(key: assemble, value?) {
    // 只允许一次设置 data 参数
    if (
      (typeof key == "function" || typeof key == "object") &&
      this.CanSetData == true
    ) {
      this.CanSetData = false;
      if (typeof key == "function") {
        this.Data = key();
        return this;
      }
      if (typeof key == "object") {
        this.Data = key;
        return this;
      }
    }
    // 连续多次设置data 参数
    if (typeof key == "string" && value) {
      this.Data[key] = value;
      return this;
    }

    throw new Error(
      "TypeError in TarsusRequest|assemble >>>: key | value is not standardized"
    );
  }

  public async payload() {
    this.Body["data"] = await this.Data;
    return this.Body;
  }
}

// class TarsusProxyRequest {
//   // data
//   public static async send(target: target, data: TarsusRequest["Body"]) {
//     return await axios({
//       url: target.target,
//       method: "post",
//       data,
//     });
//   }
// }

/**
 * @Target 远端微服务的代理地址
 * */
function Target(target: string) {
  return function (
    value: new (...args: any[]) => any,
    context: ClassDecoratorContext
  ) {
    value.prototype.target = target;
  };
}

/**
 * @Target 远端具体微服务
 * */
function Project(project: string) {
  return function (
    value: (...args: any[]) => any,
    context: ClassMethodDecoratorContext
  ) {
    async function TargetRequest(this: any, ...args: any) {
      const result = await value.call(this, ...args);
      const target = this.target;

      result.proxy = project;

      //【 测试Target 】
      // result.target = target;
      //【 测试结果 】
      // return result;

      return await axios({ data: result, url: target, method: "post" });
    }
    return TargetRequest;
  };
}

// (async function () {
//   @Target("http://localhost:9811")
//   class TarsusTestRequest {
//     @Project("NodeDemo")
//     public async NodeRequest(data) {
//       return data;
//     }
//   }
//   const test = new TarsusTestRequest()
//   const req1 = TarsusRequest.create("helloInterFace", "say").assemble({ a: "1", b: "2" }).payload();
//   const req2 = TarsusRequest.create("helloInterFace", "say").assemble(async () => {
//     const data = await new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ a: "3", b: "4" });
//       },1000)
//     })
//     return data
//   }).payload();

//   const ret1 = await test.NodeRequest(req1);
//   console.log(ret1);
//   const ret2 = await test.NodeRequest(req2);
//   console.log(ret2);

// // {
// //   interFace: 'helloInterFace',
// //   method: 'say',
// //   data: { a: '1', b: '2' },
// //   proxy: 'NodeDemo',
// //   target: 'http://localhost:9811'
// // }
// // {
// //   interFace: 'helloInterFace',
// //   method: 'say',
// //   data: { a: '3', b: '4' },
// //   proxy: 'NodeDemo',
// //   target: 'http://localhost:9811'
// // }
  
// })();

export {
  TarsusRequest,
  Target,
  Project
};
