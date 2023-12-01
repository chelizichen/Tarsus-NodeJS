// @ts-nocheck
import { T_WStream,T_RStream } from '../stream/index'
import { T_Map, T_String, T_Vector } from '../category/index'


class TST_WSTREAM_A extends T_WStream{
    static _t_className = 'struct<TST_WSTREAM_A>';

    Serialize(){
        const testMap = new T_Map(T_String,T_String);
        testMap.set('a','1')
        testMap.set('b','2')
        testMap.set('c','3')
        testMap.set('d','4')
        const testVector = new T_Vector(T_String);
        testVector.push("aaa");
        testVector.push("bbb");
        testVector.push("ccc");

        this.WriteInt8    (0,11)
        this.WriteInt16   (1,22)
        this.WriteInt32   (2,33)
        this.WriteInt64   (3,BigInt(64))
        this.WriteString  (4,"chelizichen")
        this.WriteMap     (5,testMap)
        this.WriteVector  (6,testVector)
        const testStruct = new TST_WSTREAM_B();
        this.WriteStruct  (7,testStruct)
        return this;
    }   
    constructor(){
        super()
    }
}
class TST_WSTREAM_B extends T_WStream{
    static _t_className = 'struct<TST_WSTREAM_A>';

    Serialize(){
        const testMap = new T_Map(T_String,T_String);
        testMap.set('a','1')
        testMap.set('b','2')
        testMap.set('c','3')
        testMap.set('d','4')
        const testVector = new T_Vector(T_String);
        testVector.push("aaa");
        testVector.push("bbb");
        testVector.push("ccc");

        this.WriteInt8    (0,11)
        this.WriteInt16   (1,22)
        this.WriteInt32   (2,33)
        this.WriteInt64   (3,BigInt(64))
        this.WriteString  (4,"chelizichen")
        this.WriteMap     (5,testMap)
        this.WriteVector  (6,testVector)
        return this;
    }   
    constructor(){
        super()
    }
}

class TST_WSTREAM extends T_WStream{
    static _t_className = 'struct<TST_WSTREAM>';

    Serialize(){
        const testMap = new T_Map(T_String,T_String);
        testMap.set('a','1')
        testMap.set('b','2')
        testMap.set('c','3')
        testMap.set('d','4')
        const testVector = new T_Vector(T_String);
        testVector.push("aaa");
        testVector.push("bbb");
        testVector.push("ccc");
        const testStruct = new TST_WSTREAM_A();

        this.WriteInt8    (0,11)
        this.WriteInt16   (1,22)
        this.WriteInt32   (2,33)
        this.WriteInt64   (3,BigInt(64))
        this.WriteString  (4,"chelizichen")
        this.WriteMap     (5,testMap)
        this.WriteVector  (6,testVector)
        this.WriteStruct  (7,testStruct)
        return this;
    }   
    constructor(){
        super()
    }
}

class TST_RSTREAM_A extends T_RStream{
    public a;
    public b;
    public c;
    public d;
    public e;
    public f;
    public g;
    public h;

    Deserialize(){
        this.a = this.ReadInt8    (0)
        this.b = this.ReadInt16   (1)
        this.c = this.ReadInt32   (2)
        this.d = this.ReadInt64   (3)
        this.e = this.ReadString  (4)
        this.f = this.ReadMap     (5,T_String,T_String)
        this.g = this.ReadVector  (6,T_String)
        this.h = this.ReadStruct  (7,TST_RSTREAM_B)
        return this;
    }

    constructor(buf:Buffer){
        super(buf)
        super.Deserialize = this.Deserialize;
    }
}

class TST_RSTREAM_B extends T_RStream{
    public a;
    public b;
    public c;
    public d;
    public e;
    public f;
    public g;
    public h;

    Deserialize(){
        this.a = this.ReadInt8    (0)
        this.b = this.ReadInt16   (1)
        this.c = this.ReadInt32   (2)
        this.d = this.ReadInt64   (3)
        this.e = this.ReadString  (4)
        this.f = this.ReadMap     (5,T_String,T_String)
        this.g = this.ReadVector  (6,T_String)
        return this;
    }

    constructor(buf:Buffer){
        super(buf)
        super.Deserialize = this.Deserialize;
    }
}

class TST_RSTREAM extends T_RStream{
    public a;
    public b;
    public c;
    public d;
    public e;
    public f;
    public g;
    public h;

    Deserialize(){
        this.a = this.ReadInt8    (0)
        this.b = this.ReadInt16   (1)
        this.c = this.ReadInt32   (2)
        this.d = this.ReadInt64   (3)
        this.e = this.ReadString  (4)
        this.f = this.ReadMap     (5,T_String,T_String)
        this.g = this.ReadVector  (6,T_String)
        debugger;
        this.h = this.ReadStruct  (7,TST_RSTREAM_A)
        return this;
    }

    constructor(buf:Buffer){
        super(buf)
    }
}

function main(){
    const tst_wsStream = new TST_WSTREAM()
    let buf = tst_wsStream.Serialize().toBuf()
    const rs = new TST_RSTREAM(buf!)   
    console.log(rs.Deserialize().toObj());
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

