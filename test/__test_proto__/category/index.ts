import { T_RStream, T_WStream } from "../stream";


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
    constructor(T_Value:string){
        this._t_value = T_Value;
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

    static objToStream(){
        
    }

    static streamToObj(buf:Buffer){

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
    constructor(T_Key:string,T_Value:any){
        this._t_key = T_Key;
        this._t_value = T_Value;
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
    
    static streamToObj(buf:Buffer,T_Key:any,T_Value:any,ByteLength:number){
        console.log('buf.length',buf.length);
        console.log('buf.length',JSON.stringify(buf));
        
        const rs = new T_RStream(buf);
        const TMap = new T_Map(T_Key,T_Value);
        let tag = 0
        
        while(true){
            debugger;
            const key   = rs.ReadAny(tag++,T_Key)
            const value = rs.ReadAny(tag++,T_Value)
            console.log('key | ',key, ' | value | ',value);
            TMap.set(key,value)
            if(rs.getPosition() >= ByteLength){
                break;
            }
        }
        return TMap
    }
}

const TARSUS:Record<string,any> = {}
TARSUS.T_Vector = T_Vector;
TARSUS.T_Map = T_Map;

export{
    T_Vector,
    T_Map
}