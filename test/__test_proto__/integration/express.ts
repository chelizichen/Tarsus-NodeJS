// Integrate Tarsus-RPC Into Express
// Init Demo
// Step1 prepare a node environment
// Step2 npm run server // start a node server
// Step3 npm run express   // start a express gateway server
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
import T_GateWay from "../gateway/T_GateWay";
import express,{Request,Response} from "express";

export function useTarsusGateway(gateway: T_GateWay, router: express.Router) {
  gateway.T_Clients.forEach((v) => {
    for (let rpcMethod in v.Client) {
      if (typeof v.Client[rpcMethod] == "function") {
        const fn = v.Client[rpcMethod];
        const methodName = rpcMethod;
        const module = v.Client.module;
        let invokePath = join([module, methodName], "/");
        const invokeTemplate = function(req:Request,res:Response){
          const data = Object.assign({},req.body,req.query)
          console.log("invokePath",invokePath);
          console.log("invokeData",data);
          
          fn(data).then(invokeResp=>{
            console.log('invokeResp',invokeResp);
            res.send(invokeResp)
          }).catch(err=>{
            console.log('invokeError',err);
            res.send(err)
          })
        }
        router.post("/" + invokePath, invokeTemplate);
      }
    }
  });
  return router;
}

