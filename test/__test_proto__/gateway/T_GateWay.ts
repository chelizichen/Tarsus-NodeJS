import net from 'net'
import T_Client from '../communicate/client';
import { Constructor, T_GateWayClient } from '../type';
import _ from 'lodash';



// NEW T_GateWay Example
// import LoadAmpleProxy from '../proxy/Ample'
// const AmpleProxy = {
//      Module:"Ample",
//      Conn:{
//          port:24001,
//      },
//      ClientProxy:LoadAmpleProxy
// }
// const ProxyClients = [AmpleProxy]
// const gateway = new T_GateWay(ProxyClients)
// gateway.InvokeRpcMethod("Ample","getUserList",data)
class T_GateWay{

    public T_Clients:Array<any>;

    // Common -- 
    // const client = new T_Client({
    //     'port':24001
    // })
    // const ClientProxy = new LoadAmpleProxy(client);
    // Simply -- 
    // new LoadAmpleProxy(new T_Client({ port: 24001 })) 
    // TYPE : { Module:String; Conn:NetStartOption; ClientProxy:ProxyHandler }

    constructor(conns:Array<{Module:string;Conn:net.SocketConnectOpts;ClientProxy:any}>){
        this.T_Clients = conns.map(v=>{
            return {
                Client:new v.ClientProxy(new T_Client(v.Conn)),
                Module:v.Module
            }
        })
    }

    // ClientProxy.getUserList({
    //     basicInfo:{
    //         token:"qwe123asd123",
    //         detail:{
    //             a:"1",
    //             b:"2"
    //         }
    //     },
    //     page:{
    //         offset:0,
    //         size:10,
    //         keyword:"hello world"
    //     }
    // }).then(res=>{
    //     console.log('getUserList',res);
    // })
    // INVOKE Will Return A Promise
    async InvokeRpcMethod(Module:string,Method:string,data:any){
        const T_Client = this.T_Clients.find(v=>v.Module == Module)
        return await _.invoke(T_Client.Client,Method,data)
    }

}


export default T_GateWay;