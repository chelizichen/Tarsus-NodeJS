// T_WStream T_RStream:  serialize and deserialize utils
// compatible   with nodes and browsers
// created by   chelizichen
// <Tag<int8>,Length<Optional<int32>>,Value<any>> as TLV
// This protocol uses TLV for decoding and encoding of underlying protocols

import _ from "lodash";
import { T_String,T_Vector,T_Map, T_INT8, T_INT16, T_INT32, T_INT64 } from "../category";
import {Logger, WillOverride} from '../decorator/index'
import { T_BASE } from '../type/index'

(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");


class T_WStream {
    private originView :   DataView | undefined;
    private position   :   number = 0;
    private originBuf  :   Buffer | undefined;
    private _capacity  :   number = 0;
    private positionMap = new Map<number,number>();
    constructor() {
        this._capacity = 0;
        this.originBuf = this.createBuffer(this._capacity)
        this.originView = new DataView(this.originBuf!.buffer);
    }
    createBuffer(size:number){
        return Buffer.alloc(size);
    }
    private allocate(byteLength){
        if (this._capacity > this.position + byteLength) {
            return ;
        }
        this._capacity = Math.max(512, (this.position + byteLength) * 2);
        const tempBuf = this.createBuffer(this._capacity);
        if(this.originBuf != null){
            this.originBuf.copy!(tempBuf,this.position);
            this.originBuf = undefined;
            this.originView = undefined;
        }
        this.originBuf = tempBuf;
        this.originView = new DataView(this.originBuf.buffer)
    }
    WriteAny(tag:number,value:any,type:any){
        switch(type){
            case "int8":{
                this.WriteInt8(tag,value)
                break;
            }
            case "int16":{
                this.WriteInt16(tag,value)
                break;
            }
            case "int32":{
                this.WriteInt32(tag,value)
                break;
            }
            case "int64":{
                this.WriteInt64(tag,value)
                break;
            }
            case "string":{
                this.WriteString(tag,value)
                break;
            }
        }
    }

    WriteInt8(tag:number,value:number){
        this.position += 1;
        this.allocate(1);
        this.positionMap.set(tag,this.position - 1)
        this.originView!.setInt8(this.position - 1,value)
    }

    WriteInt16(tag:number,value:number){
        this.position += 2;
        this.allocate(2);
        this.positionMap.set(tag,this.position - 2)
        this.originView!.setInt16(this.position - 2,value)
    }

    WriteInt32(tag:number,value:number){
        this.position += 4;
        this.allocate(4);
        this.positionMap.set(tag,this.position - 4)
        this.originView!.setInt32(this.position - 4,value)
    }

    WriteInt64(tag:number,value:bigint){
        this.position += 8;
        this.allocate(8);
        this.positionMap.set(tag,this.position - 8)
        this.originView!.setBigInt64(this.position - 8,value)
    }

    // @Logger("WriteString |",true)
    WriteString(tag:number,value:string){
        // Fristly, We should get target string's bytelength
        let encoded = new TextEncoder().encode(value);
        this.position += 4;
        this.allocate(4);
        this.positionMap.set(tag,this.position - 4);
        this.originView!.setInt32(this.position - 4,encoded.byteLength);

        // Then, We should allocate our buffer
        this.allocate(encoded.byteLength);
        for (let i = 0; i < encoded.byteLength; i++) {  
            this.originView!.setInt8(this.position + i, encoded[i]);  
        }
        this.position += encoded.byteLength;
    }

    WriteBuf(tag:number,value:Buffer){
        if(tag == -1){
            value.copy(this.originBuf,this.position,0,this.originBuf.byteLength)
            this.originView = new DataView(this.originBuf.buffer)
            return;
        }
        debugger;
        const position = value.byteLength;
        this.position += 4;
        this.allocate(4);
        this.originView.setInt32(this.position - 4 ,position);
        this.positionMap.set(tag,this.position - 4);
        this.allocate(position);
        this.WriteBuf(-1,value);
        this.position += position;
        return
    }

    WriteStruct<T extends new ()=>T_WStream>(tag:number, value:any, WriteStream:T){
        const ws = new WriteStream()
        ws.Serialize(value)
        const position = ws.position;
        this.position += 4
        this.allocate(4)
        this.originView.setInt32(this.position - 4,position)
        this.positionMap.set(tag,this.position - 4);
        this.allocate(position)
        console.log('position',position);
        this.WriteBuf(-1, ws.toBuf())
        this.position += position;
    }

    WriteMap(tag:number, value:T_Map,T_Key?:T_BASE,T_Value?:T_BASE){
        const isTarsCategory = Reflect.has(value,"__getClass__") || (value instanceof T_Map);
        if(!isTarsCategory){
            const tempVal = _.cloneDeep(value);
            const tempT_Map = new T_Map(T_Key,T_Value)
            tempT_Map.pack(tempVal)
            value = tempT_Map;
        }

        const ws = T_Map.objToStream(value)
        const position = ws.position;
        this.position += 4;
        this.allocate(4);
        this.positionMap.set(tag,this.position - 4);
        this.originView!.setInt32(this.position - 4, position);
        this.allocate(position)
        this.WriteBuf(-1, ws.toBuf())
        this.position += position;
    }

    WriteVector(tag:number,value:T_Vector,T_Value:any){
        const isTarsCategory = Reflect.has(value,"__getClass__") || (value instanceof T_Vector);
        if(!isTarsCategory){
            const tempVal = _.cloneDeep(value);
            const tempT_Map = new T_Vector(T_Value)
            tempT_Map.pack(tempVal)
            value = tempT_Map;
        }
        const ws = T_Vector.objToStream(value);
        const position = ws.position;
        this.position += 4;
        this.allocate(4);
        this.positionMap.set(tag,this.position - 4);
        this.originView!.setInt32(this.position - 4, position);
        this.allocate(position)
        this.WriteBuf(-1, ws.toBuf())
        this.position += position;
    }

    @WillOverride
    Serialize(obj?:any){ return this;}

    toBuf(){
        return this.originBuf
    }

}

class T_RStream{
    private originView :   DataView;
    private originBuf  :   Buffer;
    private position   :   number = 0;
    private readStreamToObj:{ [key: string]: any } = new Object();

    public getMetaData(key){
        const metadata = _.get(this,'__proto__.constructor')[Symbol.metadata]
        return _.get(metadata,key);
    }

    public toObj(T_TYPE?:T_BASE){
        if(T_TYPE && T_TYPE._t_className === T_Vector._t_className){
            // 如果 nestedObject 存在，则返回其值，否则返回一个空对象
            const result = this.readStreamToObj.undefined
            return result;
        }
        return this.readStreamToObj;
    }
    public getPosition(){
        return this.position;
    }
    createBuffer(size:number){
        return Buffer.alloc(size);
    }
    constructor(buf:Buffer){
        this.originView = new DataView(buf.buffer);
        this.originBuf = buf;
    }
    ReadAny(tag:number,type:any,T_KEY?:string,T_VALUE?:string){
        switch(type){
            case T_INT8._t_className:{
                return this.ReadInt8(tag)
            }
            case T_INT16._t_className:{
                return this.ReadInt16(tag)
            }
            case T_INT32._t_className:{
                return this.ReadInt32(tag)
            }
            case T_INT64._t_className:{
                return this.ReadInt64(tag)
            }
            case T_String._t_className:{
                return this.ReadString(tag)
            }
            case T_Map._t_className:{
                return this.ReadMap(tag,T_KEY,T_VALUE)
            }
        }
    }
    ReadInt8(tag:number):string{
        this.position += 1;
        const tagField = this.getMetaData(`Tag.${tag}`)
        this.readStreamToObj[tagField] =  this.originView.getInt8(this.position - 1)
        return this.readStreamToObj[tagField]
    }

    ReadInt16(tag:number):string{
        this.position += 2;
        const tagField = this.getMetaData(`Tag.${tag}`)
        this.readStreamToObj[tagField] = this.originView.getInt16(this.position - 2)
        return this.readStreamToObj[tagField];
    }

    ReadInt32(tag:number):string{
        this.position += 4;
        const tagField = this.getMetaData(`Tag.${tag}`)
        this.readStreamToObj[tagField] = this.originView.getInt32(this.position - 4)
        return this.readStreamToObj[tagField];
    }

    ReadInt64(tag:number):bigint{
        this.position += 8;
        const tagField = this.getMetaData(`Tag.${tag}`)
        this.readStreamToObj[tagField] =  this.originView.getBigInt64(this.position - 8)
        return this.readStreamToObj[tagField]
    }

    // @Logger("ReadString |",false)
    ReadString(tag:number):string{
        this.position += 4;
        const byteLength = this.originView.getInt32(this.position - 4);
        let stringArray:number[] = [];
        for (let i = 0; i < byteLength; i++) {
            stringArray.push(this.originView.getInt8(this.position + i));  
        }
        const tagField = this.getMetaData(`Tag.${tag}`)
        this.readStreamToObj[tagField] = String.fromCharCode(...stringArray)
        this.position += byteLength;
        return this.readStreamToObj[tagField];
    }

    ReadBuf(tag:number):Buffer{
        this.position += 4;
        const ByteLength = this.originView.getInt32(this.position - 4)
        const buf = this.createBuffer(ByteLength);
        this.originBuf.copy(buf,0, this.position, this.position + ByteLength)
        this.position += ByteLength;
        const tagField = this.getMetaData(`Tag.${tag}`)
        this.readStreamToObj[tagField] = buf;
        return this.readStreamToObj[tagField];
    }

    ReadMap(tag:number,T_Key:any,T_Value:any){
        this.position += 4;
        const ByteLength = this.originView.getInt32(this.position - 4);
        const temp = this.createBuffer(ByteLength);
        this.originBuf.copy(temp,0, this.position, this.position + ByteLength)
        const Obj = T_Map.streamToObj(temp,T_Key,T_Value,ByteLength);
        const tagField = this.getMetaData(`Tag.${tag}`)
        this.readStreamToObj[tagField] = Obj.toObj();
        this.position += ByteLength;
        return this.readStreamToObj[tagField];
    }

    ReadVector(tag:number,T_Value:any):any[]{
        this.position += 4;
        const ByteLength = this.originView.getInt32(this.position -  4);
        if(!ByteLength){
            const tagField = this.getMetaData(`Tag.${tag}`)
            this.readStreamToObj[tagField] = [];
            return this.readStreamToObj[tagField];
        }
        const temp = this.createBuffer(ByteLength);
        this.originBuf.copy(temp,0, this.position, this.position + ByteLength)
        const Obj = T_Vector.streamToObj(temp,T_Value,ByteLength)
        const tagField = this.getMetaData(`Tag.${tag}`)
        this.readStreamToObj[tagField] = Obj.toObj();
        this.position += ByteLength;
        return this.readStreamToObj[tagField];
    }

    ReadStruct<T extends new (...args:any[]) => T_RStream>(tag:number,Struct: T){
        this.position += 4;
        const ByteLength = this.originView.getInt32(this.position -  4);
        console.log('ByteLength',ByteLength);
        const temp = this.createBuffer(ByteLength);
        this.originBuf.copy(temp,0, this.position, this.position + ByteLength)
        const struct = new Struct(temp)
        const Obj = struct.Deserialize();
        this.position += ByteLength;
        const tagField = this.getMetaData(`Tag.${tag}`)
        this.readStreamToObj[tagField] = Obj.toObj();
        return this.readStreamToObj[tagField];
    }

    @WillOverride
    Deserialize(){return this}

}


export{
    T_RStream,
    T_WStream
}