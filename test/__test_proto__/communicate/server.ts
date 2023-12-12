import { EventEmitter } from "events";
import * as net from 'net'
import { $WriteHead, CONSTANT, CommunicateBase, isAsyncFunction } from './utils';
import { T_RStream, T_WStream } from "../stream";
import { JceStruct } from "../type";
import { T_Container, T_String } from "../category";
import {uid} from 'uid';
import _ from 'lodash';
import { InvokeContext } from '../type/index'
import Ample, { LoadAmpleServer } from "../bin/ample";
import { LoadSampleServer } from "../bin/Sample";


class T_Server extends CommunicateBase{

    public localData:Buffer | undefined; // 本地缓冲区
    public Position:number;
    public BufferLength:number;
    public Servant;
    public Connection;
    public Socket   :   net.Socket;

    constructor(conn:net.NetConnectOpts){
        super()
        this.Reset();
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
        const View = new DataView(buf.buffer)
        const NonExistent = this.Position === 0;
        // 当前缓冲区是正常的
        if(NonExistent){
            // 4 是 byteLength头
            const BufferLength = View.getInt32(0) + 4;
            // 完整包
            if(View.byteLength == BufferLength){
                // this.$WriteToClient(buf);
                this.readBuffer(buf)
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
                const tempBuf = Buffer.alloc(View.byteLength - BufferLength);
                buf.copy(tempBuf,0,BufferLength);
                if(View.byteLength - BufferLength != 0){
                    this.$OnData(tempBuf);
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

    readBuffer(buf:Buffer){
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
            ws.WriteString(2,context.invokeResponse);
            console.log('context.traceId',context.traceId);
            ws.WriteVector(3,context.traceId,T_String);
            ws.WriteStruct(4,data,that.$ReflectGetClass(context.invokeResponse).Write);
            that.$WriteToClient(ws.toBuf())
        };
        const fn = T_Container.GetMethod(context.moduleName,context.invokeMethod)
        if(isAsyncFunction(fn)){
            const resp = fn(context,invokeRequestBody)
            context.sendResponse(resp);
            return;
        }
        (fn)(context,invokeRequestBody).then(resp=>{
            context.sendResponse(resp);
        })
    }

    addRecord(){

    }

    $WriteToClient(data:Buffer){
        const _buf = $WriteHead(data)
        if(!this.Socket){
            return;
        }
        this.Socket.write(_buf)
    }

    $OnConnect(...args){
        console.log("已有用户链接",args);
    }

    Registration(Socket:net.Socket){
        Socket.on('data',this.$OnData.bind(this));
        Socket.on("connect",this.$OnConnect.bind(this))
    }

    Reset(){
        this.localData = undefined;
        this.localData = Buffer.alloc(0);
        this.Position = 0;
        this.BufferLength = 0;
    }

    BindModule(moduleServer){
        const module = new moduleServer();
        console.log('module', module.module + ' is load success');
        
    }
}



const server = new T_Server({
    'port':24001
})


LoadAmpleServer.prototype.getUserList = function(){
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
            // id:0,
            // name:'leemulus',
            // age:13,
            // phone:'12321412321',
            // address:'wuhan'
        },
    }
}

LoadAmpleServer.prototype.getUser = async function(){
    return {
        data: {
            id:0,
            name:'leemulus',
            age:13,
            phone:'12321412321',
            address:'wuhan'
        },
        code:0,
        message:'ok'
    }
}


LoadAmpleServer.prototype.setUser = async function(){
    return {

    }
}
// LoadSampleServer.prototype.getUserById = async function() {
//     return {

//     }
// }
// const arr = new Uint8Array([0, 0, 2, 0, 0, 0, 0, 5, 65, 109, 112, 108, 101, 0, 0, 0, 11, 103, 101, 116, 85, 115, 101, 114, 76, 105, 115, 116, 0, 0, 0, 22, 83, 116, 114, 117, 99, 116, 60, 103, 101, 116, 85, 115, 101, 114, 76, 105, 115, 116, 82, 101, 113, 62, 0, 0, 0, 15, 0, 0, 0, 11, 99, 52, 99, 49, 56, 98, 49, 50, 53, 55, 100, 0, 0, 0, 67, 0, 0, 0, 40, 0, 0, 0, 12, 113, 119, 101, 49, 50, 51, 97, 115, 100, 49, 50, 51, 0, 0, 0, 20, 0, 0, 0, 1, 97, 0, 0, 0, 1, 49, 0, 0, 0, 1, 98, 0, 0, 0, 1, 50, 0, 0, 0, 19, 0, 0, 0, 10, 0, 0, 0, 11, 104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 5, 65, 109, 112, 108, 101, 0, 0, 0, 7, 103, 101, 116, 85, 115, 101, 114, 0, 0, 0, 15, 83, 116, 114, 117, 99, 116, 60, 81, 117, 101, 114, 121, 73, 100, 62, 0, 0, 0, 15, 0, 0, 0, 11, 52, 99, 49, 56, 98, 49, 50, 53, 55, 100, 100, 0, 0, 0, 45, 1, 0, 0, 0, 40, 0, 0, 0, 12, 113, 119, 101, 49, 50, 51, 97, 115, 100, 49, 50, 51, 0, 0, 0, 20, 0, 0, 0, 1, 97, 0, 0, 0, 1, 49, 0, 0, 0, 1, 98, 0, 0, 0, 1, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
// console.log(arr.length);
// server.BindModule(LoadSampleServer)
server.BindModule(LoadAmpleServer)

// const buf = new Uint8Array([0, 0, 2, 0, 0, 0, 0, 5, 65, 109, 112, 108, 101, 0, 0, 0, 11, 103, 101, 116, 85, 115, 101, 114, 76, 105, 115, 116, 0, 0, 0, 22, 83, 116, 114, 117, 99, 116, 60, 103, 101, 116, 85, 115, 101, 114, 76, 105, 115, 116, 82, 101, 113, 62, 0, 0, 0, 15, 0, 0, 0, 11, 100, 100, 57, 102, 98, 99, 49, 57, 97, 53, 53, 0, 0, 0, 67, 0, 0, 0, 40, 0, 0, 0, 12, 113, 119, 101, 49, 50, 51, 97, 115, 100, 49, 50, 51, 0, 0, 0, 20, 0, 0, 0, 1, 97, 0, 0, 0, 1, 49, 0, 0, 0, 1, 98, 0, 0, 0, 1, 50, 0, 0, 0, 19, 0, 0, 0, 10, 0, 0, 0, 11, 104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
// const Buf = Buffer.from(arr.buffer)

// server.$OnData(Buf);

export default T_Server;