import { EventEmitter } from "events";
import * as net from 'net'
import { $WriteHead, CONSTANT, CommunicateBase } from './utils';
import { T_RStream, T_WStream } from "../stream";
import { JceStruct } from "../type";
import { T_Container, T_String } from "../category";
import {uid} from 'uid';
import _ from 'lodash';
import { InvokeContext } from '../type/index'
import Ample from "../bin/ample";

class TarsService{
    async getUserList(ctx:InvokeContext,req){
        console.log('ctx',ctx);
        console.log('req',req);
        return {
            code:0,
            message:'ok',
            data:[
                {
                    id:0,
                    name:'leemulus',
                    age:13,
                    phone:'12321412321',
                    address:'wuhan'
                },
                {
                    id:1,
                    name:'leemulus',
                    age:14,
                    phone:'12321412321',
                    address:'wuhan'
                },
                {
                    id:2,
                    name:'leemulus',
                    age:15,
                    phone:'12321412321',
                    address:'wuhan'
                }
            ],
            user: {
                id:0,
                name:'leemulus',
                age:13,
                phone:'12321412321',
                address:'wuhan'
            },
        }
    }

    InitMetaData(){

        T_Container.SetMethod("Ample","getUserList",this.getUserList)
        T_Container.SetRpcMethod("getUserList",'Struct<getUserListReq>','Struct<getUserListRes>')
        T_Container.Set(Ample.getUserListReq)
    }
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
        debugger;
        console.log('recieved buffer ',buf.byteLength);
        const View = new DataView(buf.buffer)
        const NonExistent = this.Position === 0;
        // 当前缓冲区是正常的
        if(NonExistent){
            // 4 是 byteLength头
            const BufferLength = View.getInt32(0) + 4;
            console.log('readBufferLength',BufferLength);
            
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
            // 一次发了多个包过来
            if(View.byteLength > BufferLength){
                const spliceBuf = buf.subarray(0,BufferLength);
                this.readBuffer(spliceBuf);
                const otherBuf = buf.subarray(BufferLength)
                if(otherBuf.byteLength != 0){
                    this.$OnData(otherBuf);
                }
                return;
            }
        }

        if(!NonExistent){
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
        console.log('that.$ReflectGetClass(invokeRequest)',invokeRequest,that.$ReflectGetClass(invokeRequest));
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
            ws.WriteString(2,context.invokeResponse);
            console.log('context.traceId',context.traceId);
            ws.WriteVector(3,context.traceId,T_String);
            ws.WriteStruct(4,data,that.$ReflectGetClass(context.invokeResponse).Write);
            that.$WriteToClient(ws.toBuf())
        };
        console.log(context.moduleName,context.invokeMethod);
        (T_Container.GetMethod(context.moduleName,context.invokeMethod))(context,invokeRequestBody).then(resp=>{
            context.sendResponse(resp);
        })
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
        Socket.on('data',this.$OnData.bind(this));
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

