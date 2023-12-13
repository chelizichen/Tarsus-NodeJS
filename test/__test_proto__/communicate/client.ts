import { EventEmitter } from "events";
import * as net from 'net'
import { $WriteHead, CommunicateBase, TimesCall } from "./utils";
import { T_RStream, T_WStream } from "../stream";
import { T_Container, T_String, T_Vector } from "../category";
import { uid } from "uid";
import Ample, { LoadAmpleProxy } from "../bin/ample";
import { LoadSampleProxy } from "../bin/Sample";


class T_Client extends CommunicateBase{

    public localData : Buffer | undefined; // 本地缓冲区
    public Position:number;
    public BufferLength:number;
    public Servant  :   net.SocketConnectOpts;
    public Connection;
    public Socket   :   net.Socket;
    public Events   :   EventEmitter;
    constructor(Servant:net.SocketConnectOpts){
        super()
        this.Events = new EventEmitter();
        this.Reset();
        this.Socket = new net.Socket();
        this.Socket.connect(Servant)
        this.Servant = Servant;
        this.Registration(this.Socket)
    }

    // 拿到包以后需要先判断包是否完整
    // 如果不完整，则存入localData中
    $OnData(buf:Buffer){
        console.log("获取到数据");
        console.log(buf.toString());
        
        const View = new DataView(buf.buffer)
        const NonExistent = this.Position === 0;
        // 当前缓冲区是正常的
        if(NonExistent){
            const BufferLength = View.getInt32(0) + 4;
            // 完整包
            if(View.byteLength == BufferLength){
                this.$ResponseToGateWay(buf)
                this.Reset()
                return;
            }
            // 不完整包 包大小 < 给定的大小
            if(View.byteLength < BufferLength){
                this.BufferLength = BufferLength;
                this.Position += View.byteLength;
                this.localData = Buffer.concat([this.localData!,buf])
                return;
            }
            // 一次发了多个包过来
            if(View.byteLength > BufferLength){
                const spliceBuf = buf.subarray(0,BufferLength);
                this.$ResponseToGateWay(spliceBuf)
                const otherBuf = buf.subarray(BufferLength)
                if(otherBuf.byteLength != 0 && (otherBuf.every(v=>v !== 0))){
                    this.$OnData(otherBuf);
                }
                return;
            }

        }

        if(!NonExistent){
            const BufferLength = buf.byteLength;
            const canWrite = this.Position + BufferLength === this.BufferLength;
            if(canWrite){
                const _buf = Buffer.concat([this.localData!,buf])
                this.$ResponseToGateWay(_buf)
                this.Reset()
            }
            if(!canWrite){
                this.Position += View.byteLength;
                this.localData = Buffer.concat([this.localData!,Buffer.from(View.buffer)])
            }
        }
    }

    $ResponseToGateWay(buf:Buffer){
        const rs = new T_RStream(buf)
        rs.ReadInt32(0); // length
        rs.ReadString(1); // moudleName
        rs.ReadString(2); // method
        const invokeResponse        = rs.ReadString(3); // resp
        const traceId               = rs.ReadVector(4,T_String); // traceId
        const invokeResponseBody    = rs.ReadStruct(5,this.$ReflectGetClass(invokeResponse).Read);
        this.Events.emit(traceId[0],invokeResponseBody)
    }

    $OnConncet(){
    //   this.Test()
        // @ts-ignore
        console.log(`已连接至${this.Servant.port}`);
    }

    $WriteToServer(data:Buffer){
        const TransmitBuf = $WriteHead(data)
        this.Socket.write(Buffer.concat([TransmitBuf, Buffer.from('\n')]));
        // this.Socket.write("\n")
        // this.Socket.end()
    }

    $OnClose(){
        console.log("链接已断开");
        // setInterval(()=>{
        //     console.log("是否链接成功",this.Socket.connecting);
        //     this.Socket.connect(this.Servant)
        // },1000)
    }

    Registration(Socket:net.Socket){
        Socket.on('data',this.$OnData.bind(this));
        Socket.on('connect',this.$OnConncet.bind(this))
        Socket.on('close',this.$OnClose.bind(this))
    }
    
    Reset(){
        this.localData = undefined;
        this.localData = Buffer.alloc(0);
        this.Position = 0;
        this.BufferLength = 0;
    }

    $InvokeRpc(module:string,method:string,request:string,body){
        return new Promise((resolve)=>{
            const ws = new T_WStream();
            const traceIds = new T_Vector(T_String)
            const traceReqId =  uid();
            traceIds.push(traceReqId)
            ws.WriteString(0,module);
            ws.WriteString(1,method);
            ws.WriteString(2,request);
            ws.WriteVector(3,traceIds,T_String);
            ws.WriteStruct(4,body,this.$ReflectGetClass(request).Write)
            this.$WriteToServer(ws.toBuf())
            this.Events.on(traceReqId,resp=>resolve(resp));
        })
    }

}


// const client = new T_Client({
//     'port':24001
// })

// T_Container.Set(Ample.getUserListReq)
// T_Container.Set(Ample.getUserListRes)


// const ClientProxy = new LoadAmpleProxy(client);

// TimesCall(()=>
//     ClientProxy.getUserList({
        // basicInfo:{
        //     token:"qwe123asd123",
        //     detail:{
        //         a:"1",
        //         b:"2"
        //     }
        // },
        // page:{
        //     offset:0,
        //     size:10,
        //     keyword:"hello world"
        // }
//     }).then(res=>{
//         console.log('getUserList',res);
//     })
// ,5)

// TimesCall(()=>
//     ClientProxy.getUser({
//         id:1,
//         basicInfo:{
//             token:"qwe123asd123",
//             detail:{
//                 a:"1",
//                 b:"2"
//             }
//         },
//     }).then(res=>{
//         console.log('getUser',res);
//     })
// ,5)


// const client = new T_Client({
//     'port':24001
// })

// const client = new T_Client({
//     'port':24511
// })

// const ClientProxy = new LoadSampleProxy(client);

// // TimesCall(()=>
// setTimeout(()=>{
//     ClientProxy.getUserById({
//         id:77,
//         basicInfo:{
//          token:'asd123',
//          traceId:5411
//         }
//      }).then(res=>{
//          console.log('getUserById',res);
//      })
// },2000)

// ,5)

export default T_Client;


