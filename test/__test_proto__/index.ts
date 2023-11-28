// T_WStream T_RStream:  serialize and deserialize utils
// compatible   with nodes and browsers
// created by   chelizichen



class T_WStream {
    public originView :   DataView;
    public position   :   number = 0;
    public originBuf  :   Buffer | undefined;
    public _capacity  :   number = 0;
    constructor() {
        this._capacity = 0;
        this.createBuffer(this._capacity)
        this.originView = new DataView(this.originBuf!.buffer);
    }
    createBuffer(size:number){
        return Buffer.alloc(size);
    }
    allocate(byteLength){
        if (this._capacity > this.position + byteLength) {
            return ;
        }
        this._capacity = Math.max(512, (this.position + byteLength) * 2);
        const tempBuf = this.createBuffer(this._capacity);
        if(this.originBuf != null){
            this.originBuf.copy!(tempBuf,0,0,this.position);
            this.originBuf = undefined
        }
        this.originBuf = tempBuf;
    }
    WriteInt8(tag:number,value:number){
        this.position += 1;
        this.allocate(1);
        this.originView.setInt8(tag,value)
    }

    WriteInt16(tag:number,value:number){
        this.position += 2;
        this.allocate(2);
        this.originView.setInt16(tag,value)
    }

    WriteInt32(tag:number,value:number){
        this.position += 4;
        this.allocate(4);
        this.originView.setInt32(tag,value)
    }

    WriteInt64(tag:number,value:bigint){
        this.position += 8;
        this.allocate(8);
        this.originView.setBigInt64(tag,value)
    }

    WriteString(tag:number,value:string){
        let encoded = new TextEncoder().encode(value);  
        for (let i = 0; i < encoded.length; i++) {  
            this.originView.setInt8(tag + i, encoded[i]);  
        }  
    }
}

class T_TEST_WStream extends T_WStream{
    constructor(){
        super()
        this.WriteInt8(0,10)
        this.WriteInt16(1,20)
        this.WriteInt32(2,30)
    }
}

class T_RStream{
    public originView: DataView;
    constructor(buf:Buffer){
        this.originView = new DataView(buf.buffer);
    }
    ReadInt8(tag:number){
        return this.originView.getInt8(tag)
    }
}

function main(){
    const ws = new T_TEST_WStream();
    let buf = ws.originBuf
    const rs = new T_RStream(buf!)
    rs.ReadInt8(0)
}