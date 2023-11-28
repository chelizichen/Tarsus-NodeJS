// T_WStream T_RStream:  serialize and deserialize utils
// compatible   with nodes and browsers
// created by   chelizichen



class T_WStream {
    private originView :   DataView;
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
            this.originBuf.copy!(tempBuf, 0, 0, this.position);
            this.originBuf = undefined;
            this.originView = undefined;
        }
        this.originBuf = tempBuf;
        this.originView = new DataView(this.originBuf.buffer)
    }
    WriteInt8(tag:number,value:number){
        this.position += 1;
        this.allocate(1);
        this.positionMap.set(tag,this.position - 1)
        this.originView.setInt8(this.position - 1,value)
    }

    WriteInt16(tag:number,value:number){
        this.position += 2;
        this.allocate(2);
        this.positionMap.set(tag,this.position - 2)
        this.originView.setInt16(this.position - 2,value)
    }

    WriteInt32(tag:number,value:number){
        this.position += 4;
        this.allocate(4);
        this.positionMap.set(tag,this.position - 4)
        this.originView.setInt32(this.position - 4,value)
    }

    WriteInt64(tag:number,value:bigint){
        this.position += 8;
        this.allocate(8);
        this.positionMap.set(tag,this.position - 8)
        this.originView.setBigInt64(this.position - 8,value)
    }

    WriteString(tag:number,value:string){
        // Fristly, We should get target string's bytelength
        let encoded = new TextEncoder().encode(value);
        this.position += 4;
        this.allocate(4);
        this.positionMap.set(tag,this.position - 4);
        this.originView.setInt32(this.position - 4,encoded.byteLength);

        // Then, We should allocate our buffer
        this.allocate(encoded.byteLength);
        for (let i = 0; i < encoded.length; i++) {  
            this.originView.setInt8(this.position + i, encoded[i]);  
        }
        this.position += encoded.byteLength;
    }

    toBuf(){
        return this.originBuf
    }
}

class T_RStream{
    private originView :   DataView;
    private position   :   number = 0;
    private readStreamToObj = new Object();
    public toObject(){
        return this.readStreamToObj;
    }
    constructor(buf:Buffer){
        this.originView = new DataView(buf.buffer);
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

    ReadString(tag:number){
        this.position += 4;
        const byteLength = this.originView.getInt32(this.position-4);
        let stringArray = [];
        for (let i = 0; i < byteLength; i++) {  
            stringArray.push(this.originView.getInt8(this.position + i));  
        }
        this.readStreamToObj[tag] = String.fromCharCode(...stringArray)
        return this.readStreamToObj[tag];
    }

}

class TST_WSTREAM extends T_WStream{
    public a;
    public b;
    public c;
    public d;

    constructor(){
        super()
        this.WriteInt8    (0,11)
        this.WriteInt16   (1,22)
        this.WriteInt32   (2,33)
        this.WriteInt64   (3,BigInt(64))
        this.WriteString  (4,"测试1231231")
    }
}
class TST_RSTREAM extends T_RStream{
    public a;
    public b;
    public c;
    public d;
    public e;

    constructor(buf:Buffer){
        super(buf)
        this.a = this.ReadInt8    (0)
        this.b = this.ReadInt16   (1)
        this.c = this.ReadInt32   (2)
        this.d = this.ReadInt64   (3)
        this.e = this.ReadString  (4)
    }
}

function main(){
    const tst_wsStream = new TST_WSTREAM()
    let buf = tst_wsStream.toBuf()
    const rs = new TST_RSTREAM(buf)   
    console.log(rs.toObject());
    
}

main()