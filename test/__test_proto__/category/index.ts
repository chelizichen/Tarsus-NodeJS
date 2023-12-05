import _ from "lodash";
import { T_RStream, T_WStream } from "../stream";
import { JceStruct, T_BASE, invokeMethod, invokeRequest, invokeResponse, module } from '../type/index'

(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");


class T_Vector<T = any>{
    static _t_className = 'Vector';
    public _t_value :   string = '';
    public _keys    :   Array<any> = [];
    public _values  :   Array<any> = [];
    public Value    :   Array<T> = new Array();
    public isJceStruct  :   boolean;
    __getClass__(){
        return {
            className:`${T_Vector._t_className}<${this._t_value}>`,
            valueType:this._t_value,
        }
    }
    constructor(T_Value:T_BASE){
        this._t_value = T_Value._t_className;
        this.isJceStruct = T_Container.Has(T_Value._t_className)
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

    pack(val){
        this.Value = val;
    }

    static objToStream(T_Vector:T_Vector){
        const ws = new T_WStream();
        let tag = 0;
        const obj = T_Vector.toObj();
        debugger;
        for(const value of obj){
            if(T_Vector.isJceStruct){
                const Write = T_Container.Get(T_Vector._t_value).Write;
                debugger;
                ws.WriteStruct(tag,value,Write);
            }else{
                ws.WriteAny(tag,value,T_Vector._t_value);
            }
        }
        return ws;
    }

    static streamToObj(buf:Buffer,T_Value:T_BASE,ByteLength:number){
        const rs = new T_RStream(buf)
        const TVector = new T_Vector(T_Value)
        let tag = 0;
        while(true){
            // debugger;
            if(TVector.isJceStruct){
                const Read = T_Container.Get(TVector._t_value).Read;
                rs.ReadStruct(tag++,Read)
                TVector.push(rs.toObj(T_Vector))
            }else{
                const value = rs.ReadAny(tag++, T_Value._t_className)
                console.log(value);
                
                TVector.push(value);
            }
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

    __getClass__(){
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
    pack(val){
        this.Value = val;
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
    toObj(){
        return this.Value
    }
    static objToStream(T_MapVal:T_Map){
        const ws = new T_WStream();
        let tag = 0;
        const obj = T_MapVal.toObj()
        for(let v in obj){
            ws.WriteAny(tag++,  v     , T_MapVal._t_key)
            ws.WriteAny(tag++,  obj[v], T_MapVal._t_value) 
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

class T_INT8 extends Number{
    static _t_className = 'int8'
}

class T_INT16 extends Number{
    static _t_className = 'int16'
}

class T_INT32 extends Number{
    static _t_className = 'int32'
}

class T_INT64 extends Number{
    static _t_className = 'int64'
}


class T_Container {
    static Value = new Map();
    static Set(struct:JceStruct):void{
        T_Container.Value.set(struct._t_className,struct)
    }
    static Get(className):JceStruct{
        return T_Container.Value.get(className)
    }
    static Has(className):boolean{
        return T_Container.Value.has(className);
    }

    static Methods = new Map<module,Map<invokeMethod,Function>>();
    
    static GetMethod(moduleName:module,invokeMethod:invokeMethod){
        return T_Container.Methods.get(moduleName).get(invokeMethod)
    }

    static SetMethod(module:module,invokeMethod:invokeMethod,CallBack:Function){
        if(!T_Container.Methods.has(module)){
            T_Container.Methods.set(module,new Map())
        }
        const Module = T_Container.Methods.get(module)
        Module.set(invokeMethod,CallBack)
    }

    static RpcMethods = new Map<invokeMethod,[invokeRequest,invokeResponse]>();
    static SetRpcMethod(invokeMethod:invokeMethod,invokeRequest:invokeRequest,invokeResponse){
        T_Container.RpcMethods.set(invokeMethod,[invokeRequest,invokeResponse])
    }
    static GetRpcMethod(invokeMethod:invokeMethod){
        return T_Container.RpcMethods.get(invokeMethod)
    }

    
}

class T_Utils{
    static Read2Object(target,path){
        return _.get(target,path) || {};
    }
    static Read2Number(target,path){
        return _.get(target,path) || 0;
    }
    static Read2String(target,path){
        return _.get(target,path) || '';
    }
    static Read2Vector(target,path){
        return _.get(target,path) || [];
    }
}

export{
    T_Vector,
    T_String,
    T_Map,
    T_INT8,
    T_INT16,
    T_INT32,
    T_INT64,
    T_Container,
    T_Utils
}