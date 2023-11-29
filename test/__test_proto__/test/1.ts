import { T_WStream,T_RStream } from '../stream/index'
import { T_Map, T_String } from '../category/index'

class TST_WSTREAM extends T_WStream{
    writeStruct(){
        this.WriteInt8    (0,11)
        this.WriteInt16   (1,22)
        this.WriteInt32   (2,33)
        this.WriteInt64   (3,BigInt(64))
        this.WriteString  (4,"chelizichen")
        const testMap = new T_Map(T_String,T_String);
        testMap.set('a','1')
        testMap.set('b','2')
        testMap.set('c','3')
        testMap.set('d','4')
        this.WriteMap     (5,testMap)
    }   
    constructor(){
        super()
        this.writeStruct();
    }
}
class TST_RSTREAM extends T_RStream{
    public a;
    public b;
    public c;
    public d;
    public e;
    public f;

    readStruct(){
        this.a = this.ReadInt8    (0)
        this.b = this.ReadInt16   (1)
        this.c = this.ReadInt32   (2)
        this.d = this.ReadInt64   (3)
        this.e = this.ReadString  (4)
        this.f = this.ReadMap     (5,T_String,T_String)
    }

    constructor(buf:Buffer){
        super(buf)
        this.readStruct()
    }
}

function main(){
    const tst_wsStream = new TST_WSTREAM()
    let buf = tst_wsStream.toBuf()
    const rs = new TST_RSTREAM(buf!)   
    console.log(rs.toObj());
    
}

main()


function main2(){
    const testMap = new T_Map(T_String,T_String);
    testMap.set('a','1')
    testMap.set('b','2')
    testMap.set('c','3')
    testMap.set('d','4')
    const stream = T_Map.objToStream(testMap)
    const obj = T_Map.streamToObj(stream.toBuf()!,T_String,T_String,40)
    console.log(obj.toObj());
}

// main2()

