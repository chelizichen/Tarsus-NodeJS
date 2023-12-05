import { EventEmitter } from "events";
import * as net from 'net'
import { $WriteHead, CONSTANT, CommunicateBase } from './utils';
import { T_RStream, T_WStream } from "../stream";
import { JceStruct } from "../type";
import { T_Container, T_String } from "../category";
import {uid} from 'uid';
import _ from 'lodash';

type InvokeContext = {
    byteLength: string;
    moduleName: string;
    invokeMethod:string;
    invokeRequest: string;
    traceId: any;
    sendResponse ?:Function;
    responseUid?:string;
    invokeResponse?:string;
}

class LemonServer extends CommunicateBase{

    public localData:Buffer | undefined; // 本地缓冲区
    public Position:number;
    public BufferLength:number;
    public Servant;
    public Connection;
    public Socket   :   net.Socket;

    constructor(conn:net.NetConnectOpts){
        super()
        this.Reset();
        this.InitService();
        const Server = net.createServer((socket)=>{
            this.Socket = socket;
            this.Registration(this.Socket)
        })
        Server.listen(conn)
        console.log('server listen at localhost:',conn);
        
    }

    // 拿到包以后需要先判断包是否完整
    // 如果不完整，则存入localData中
    $OnData(buf:Buffer){
        console.log('接收buffer',buf.byteLength);
        const View = new DataView(buf.buffer)
        const exist = this.Position === 0;
        // 当前缓冲区是正常的
        if(!exist){
            const BufferLength = View.getInt32(0)
            // 完整包
            if(View.byteLength == BufferLength){
                // this.$WriteToClient(buf);
                this.readBuffer(buf);
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
        }

        if(exist){
            const BufferLength = buf.byteLength;
            const canWrite = this.Position + BufferLength === this.BufferLength;
            if(canWrite){
                const feedBuf = Buffer.concat([this.localData!,buf])
                // this.$WriteToClient(feedBuf);
                this.readBuffer(feedBuf)
                this.Reset()
            }
            if(!canWrite){
                this.Position += View.byteLength;
                this.localData = Buffer.concat([this.localData!,Buffer.from(View.buffer)])
            }
        }
    }

    async readBuffer(buf:Buffer){
        const that = this;
        const rs = new T_RStream(buf)
        const byteLength = rs.ReadInt32(0);
        const moduleName = rs.ReadString(1);
        const invokeMethod = rs.ReadString(2);
        const invokeRequest = rs.ReadString(3);
        const traceId = rs.ReadVector(4,T_String);
        const invokeRequestBody = rs.ReadStruct(5,that.$ReflectGetClass(invokeRequest).Read);
        const invokeResponse = that.$ReflectGetResponse(invokeMethod);
        const context:InvokeContext = {
            byteLength,
            moduleName,
            invokeMethod,
            invokeRequest,
            traceId,
            invokeResponse
        }
        const responseUid = uid();
        context.responseUid = responseUid;
        context.sendResponse = function(data){
            context.traceId.push(context.responseUid);
            const ws = new T_WStream();
            ws.WriteString(0,context.moduleName);
            ws.WriteString(1,context.invokeMethod);
            ws.WriteString(2,context.invokeRequest);
            ws.WriteVector(3,context.traceId,T_String);
            ws.WriteStruct(4,data,that.$ReflectGetClass(context.invokeResponse).Write);
            that.$WriteToClient(ws.toBuf())
        }
        const resp = await (T_Container.GetMethod(context.moduleName,context.invokeMethod))(context,invokeRequestBody)
        context.sendResponse(resp);
    }

    addRecord(){

    }

    InitService(module = TarsService){
        new module().InitMetaData();
    }


    
    $WriteToClient(data:Buffer){
        const _buf = $WriteHead(data)
        if(!this.Socket){
            return;
        }
        this.Socket.write(_buf)
    }

    Registration(Socket:net.Socket){
        Socket.on('data',this.$OnData);
    }

    Reset(){
        this.localData = undefined;
        this.localData = Buffer.alloc(0);
        this.Position = 0;
        this.BufferLength = 0;
    }
}


export default LemonServer

const server = new LemonServer({
    'port':24001
})


class TarsService{
    hello(ctx,req){

    }

    InitMetaData(){
        T_Container.SetMethod("TarsService",this.hello.name,this.hello)
    }
}
