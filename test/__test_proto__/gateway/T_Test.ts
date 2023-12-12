import T_GateWay from "./T_GateWay";
import { LoadAmpleProxy } from "../bin/ample";
import { LoadSampleProxy } from "../bin/Sample";

function init() {
  const AmpleProxy = {
    Module: LoadAmpleProxy.module,
    Conn: {
      port: 24001,
    },
    ClientProxy: LoadAmpleProxy,
  };

  const SampleProxy = {
    Module: LoadSampleProxy.module,
    Conn: {
      port: 24511,
    },
    ClientProxy: LoadSampleProxy,
  };

  const Servers = [AmpleProxy];

  const GateWay = new T_GateWay(Servers);
  GateWay.InvokeRpcMethod(LoadAmpleProxy.module, "getUserList", {
    basicInfo: {
      token: "qwe123asd123",
      detail: {
        a: "1",
        b: "2",
      },
    },
    page: {
      offset: 0,
      size: 10,
      keyword: "hello world",
    },
  }).then(res=>{
    console.log("getUserList",res);
  });

  GateWay.InvokeRpcMethod(LoadAmpleProxy.module, "setUser", {
    id:1,
    name:'leemulus',
    age:14,
    phone:'12321412321',
    address:'wuhan',
    status:0,
  }).then(res=>{
    console.log("setUser",res);
  });
//   GateWay.InvokeRpcMethod("Ample", "getUser", {
//     id: 1,
//     basicInfo: {
//       token: "qwe123asd123",
//       detail: {
//         a: "1",
//         b: "2",
//       },
//     },
//   }).then((res) => {
//     console.log("getUser", res);
//   });

//   GateWay.InvokeRpcMethod("Sample", "getUserById", {
//     id: 77,
//     basicInfo: {
//       token: "asd123",
//       traceId: 5411,
//     },
//   }).then((res) => {
//     console.log("getUserById", res);
//   });
}

init();
