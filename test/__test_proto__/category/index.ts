import { T_RStream, T_WStream } from "../stream";


type T_BASE = {
    _t_className : string;
}

class T_Vector{
    static _t_className = 'Vector'
    _t_value = ''
    _keys = []
    _values = []
    Value = new Array();
    getClass(){
        return {
            className:`${T_Vector._t_className}<${this._t_value}>`,
            valueType:this._t_value,
        }
    }
    constructor(T_Value:T_BASE){
        this._t_value = T_Value._t_className;
    }
    push(value){
        this.Value.push(value);
    }
    length(){
        return this.Value.length;
    }
    toObj(){
        return this.Value
    }

    static objToStream(T_Vector:T_Vector){
        const ws = new T_WStream();
        let tag = 0;
        const obj = T_Vector.toObj();
        for(const value of obj){
            ws.WriteAny(tag,value,T_Vector._t_value);
        }
        return ws;
    }

    static streamToObj(buf:Buffer,T_Value:T_BASE,ByteLength:number){
        const rs = new T_RStream(buf)
        const TVector = new T_Vector(T_Value)
        let tag = 0;
        while(true){
            const value = rs.ReadAny(tag++, T_Value._t_className)
            TVector.push(value);
            if(rs.getPosition()>= ByteLength){
                break;
            }
        }
        return TVector;
    }
}
class T_Map{
    static _t_className = 'Map'
    _t_key = ''
    _t_value = ''
    Value = new Object();

    getClass(){
        return{
            className: `${T_Map._t_className}<${this._t_key},${this._t_value}>`,
            valueType:this._t_value,
            keyType:this._t_key,
        }
    }
    // default key Type is string;
    // value type is any
    constructor(T_Key:T_BASE,T_Value:T_BASE){
        this._t_key = T_Key._t_className;
        this._t_value = T_Value._t_className;
    }
    set(key,value){
        this.Value[key] = value;
    }
    get(key){
        return this.Value[key]
    }
    delete(key){
        this.Value[key] = null;
    }
    getSize(){

    }
    toObj(){
        return this.Value
    }
    static objToStream(T_Map:T_Map){
        const ws = new T_WStream();
        let tag = 0;
        const obj = T_Map.toObj()
        for(let v in obj){
            ws.WriteAny(tag++,  v     , T_Map._t_key)
            ws.WriteAny(tag++,  obj[v], T_Map._t_value) 
        }
        return ws
    }
    
    static streamToObj(buf:Buffer,T_Key:T_BASE,T_Value:T_BASE,ByteLength:number){
        const rs = new T_RStream(buf);
        const TMap = new T_Map(T_Key,T_Value);
        let tag = 0
        
        while(true){
            // debugger;
            const key   = rs.ReadAny(tag++,T_Key._t_className)
            const value = rs.ReadAny(tag++,T_Value._t_className)
            TMap.set(key,value)
            if(rs.getPosition() >= ByteLength){
                break;
            }
        }
        return TMap
    }
}

class T_String extends String{
    static _t_className = 'string'
}





export{
    T_Vector,
    T_String,
    T_Map,
    T_BASE
}