// T_WStream T_RStream:  serialize and deserialize utils
// compatible   with nodes and browsers
// created by   chelizichen
// <Tag<int8>,Length<Optional<int32>>,Value<any>> as TLV
// This protocol uses TLV for decoding and encoding of underlying protocols

import { T_Map, T_Vector } from "../category";

function Logger(log:string,ignoreResult:boolean){
    return function(originalMethod: any, _context: any){
        function replacementMethod(this: any, ...args: any[]) {
            console.log(log,' | arguments |  ',args)
            const result = originalMethod.call(this, ...args);
            !ignoreResult && console.log(log,' | result | ',result)
            return result;
        }
        return replacementMethod;
    }
}

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

    @Logger("WriteString |",true)
    WriteString(tag:number,value:string){
        // Fristly, We should get target string's bytelength
        let encoded = new TextEncoder().encode(value);
        this.position += 4;
        this.allocate(4);
        this.positionMap.set(tag,this.position - 4);
        this.originView!.setInt32(this.position - 4,encoded.byteLength);

        // Then, We should allocate our buffer
        this.allocate(encoded.byteLength);
        for (let i = 0; i < encoded.length; i++) {  
            this.originView!.setInt8(this.position + i, encoded[i]);  
        }
        this.position += encoded.byteLength;
    }

    WriteBuf(tag:number,value:Buffer){
        if(tag == -1){
            value.copy(this.originBuf,this.position,0,this.originBuf.byteLength)
            this.originView = new DataView(this.originBuf.buffer)
        }
    }

    WriteStruct(tag:number, value:T_WStream){

    }

    WriteMap(tag:number, value:T_Map){
        const ws = T_Map.objToStream(value)
        const position = ws.position;
        this.position += 4;
        this.allocate(4);
        this.positionMap.set(tag,this.position - 4);
        this.originView!.setInt32(this.position - 4, position);
        console.log('Write Position',position);
        this.allocate(position)
        this.WriteBuf(-1, ws.toBuf())
        this.position += position;
    }

    WriteVector(tag,value:T_Vector){

    }

    toBuf(){
        return this.originBuf
    }

}

class T_RStream{
    private originView :   DataView;
    private originBuf  :   Buffer;
    private position   :   number = 0;
    private readStreamToObj = new Object();

    public toObj(){
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
    ReadAny(tag:number,type:any,position?:number){
        switch(type){
            case "int8":{
                return this.ReadInt8(tag)
            }
            case "int16":{
                return this.ReadInt16(tag)
            }
            case "int32":{
                return this.ReadInt32(tag)
            }
            case "int64":{
                return this.ReadInt64(tag)
            }
            case "string":{
                return this.ReadString(tag)
            }
        }
    }
    ReadInt8(tag:number){
        this.position += 1;
        this.readStreamToObj[tag] =  this.originView.getInt8(this.position - 1)
        return this.readStreamToObj[tag]
    }

    ReadInt16(tag:number){
        this.position += 2;
        this.readStreamToObj[tag] = this.originView.getInt16(this.position - 2)
        return this.readStreamToObj[tag];
    }

    ReadInt32(tag:number){
        this.position += 4;
        this.readStreamToObj[tag] = this.originView.getInt32(this.position - 4)
        return this.readStreamToObj[tag];
    }

    ReadInt64(tag:number){
        this.position += 8;
        this.readStreamToObj[tag] =  this.originView.getBigInt64(this.position - 8)
        return this.readStreamToObj[tag]
    }

    @Logger("ReadString |",false)
    ReadString(tag:number){
        this.position += 4;
        const byteLength = this.originView.getInt32( this.position - 4);
        let stringArray:number[] = [];
        for (let i = 0; i < byteLength; i++) {  
            stringArray.push(this.originView.getInt8( this.position + i));  
        }
        this.readStreamToObj[tag] = String.fromCharCode(...stringArray)
        this.position += byteLength;
        return this.readStreamToObj[tag];
    }

    ReadMap(tag:number,T_Key:any,T_Value:any){
        debugger;
        this.position += 4;
        const ByteLength = this.originView.getInt32(this.position - 4);
        const temp = this.createBuffer(ByteLength);
        this.originBuf.copy(temp,0, this.position, this.position + ByteLength)
        const Obj = T_Map.streamToObj(temp,T_Key,T_Value,ByteLength);
        this.readStreamToObj[tag] = Obj.toObj();
        this.position += ByteLength;
        return this.readStreamToObj[tag];
    }

}


export{
    T_RStream,
    T_WStream
}