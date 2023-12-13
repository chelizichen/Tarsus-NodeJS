// Integrate Tarsus-RPC Into Express
// Init Demo
// Step1 prepare a node environment
// Step2 npm run server // start a node server
// Step3 npm run inte   // start a express gateway server
// invoke API PATH : http://localhost:3881/api/Ample/getUserList
// {
//   "basicInfo": {
//       "token": "qwe123asd123",
//       "detail": {
//           "a": "1",
//           "b": "2"
//       }
//   },
//   "page": {
//       "offset": 0,
//       "size": 10,
//       "keyword": "hello world"
//   }
// }
import { join, set } from "lodash";
import { LoadAmpleProxy } from "../bin/ample";
import { LoadSampleProxy } from "../bin/Sample";
import T_GateWay from "../gateway/T_GateWay";
import express,{Request,Response} from "express";

function initTarsus(gateway: T_GateWay, router: express.Router) {
  gateway.T_Clients.forEach((v) => {
    for (let rpcMethod in v.Client) {
      if (typeof v.Client[rpcMethod] == "function") {
        const fn = v.Client[rpcMethod];
        const methodName = rpcMethod;
        const module = v.Client.module;
        let invokePath = join([module, methodName], "/");
        const invokeTemplate = function(req:Request,res:Response){
          const data = Object.assign({},req.body,req.query)
          fn(data).then(invokeResp=>{
            console.log('invokeResp',invokeResp);
            res.send(invokeResp)
          }).catch(err=>{
            console.log('err',err);
            res.send(err)
          })
        }
        router.post("/" + invokePath, invokeTemplate);
      }
    }
  });
  return router;
}

function ExpressExample(){
  const AmpleProxy = {
    Module: LoadAmpleProxy.module,
    Conn: {
      port: 24001,
    },
    ClientProxy: LoadAmpleProxy,
  };
  
  // JavaServer 
  // const SampleProxy = {
  //   Module: LoadSampleProxy.module,
  //   Conn: {
  //     port: 24511,
  //   },
  //   ClientProxy: LoadSampleProxy,
  // };
  
  const Servers = [AmpleProxy];
  // const Servers = [SampleProxy, AmpleProxy];
  
  const GateWay = new T_GateWay(Servers);
  
  
  
  const app = express();
  const tarsusGateway = initTarsus(GateWay, express.Router());
  app.use(express.json())
  app.use("/api", tarsusGateway);
  app.listen(3881, () => {
    console.log("server started at localhost:3881");
  });
}

ExpressExample()

