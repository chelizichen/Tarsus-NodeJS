import fs from "fs";
import path from "path";
import prettier from 'prettier';

type structFields = Array<{tag:number,type:string,name:string;_type:string}>
type struct = Record<string,structFields>


class Lemon2Node {
  static includeRegex = /include\s+(\w+);/;
  static moduleRegex = /module\s+(\w+);/;
  static structRegex = /struct\s+(\w+)\s*{([^}]+)}/g;
  public include = [];
  public module = "";
  public structs:struct = {};
  public rpcs:Array<{ rpcName:string, req:string,reqName:string,res:string,resName:string }> = [];

  static Compile(target = '../test/ample.jce',type:"client"|"server" = "client") {
    const lemon2node = new Lemon2Node();
    const tlvProtocol = fs.readFileSync(path.resolve(__dirname, target), "utf-8");
    let match;

    // Match and extract include
    if ((match = Lemon2Node.includeRegex.exec(tlvProtocol)) !== null) {
      lemon2node.include.push(match[1]);
    }

    // Match and extract module
    if ((match = Lemon2Node.moduleRegex.exec(tlvProtocol)) !== null) {
      lemon2node.module = match[1];
    }

    // Match and extract structs
    while ((match = Lemon2Node.structRegex.exec(tlvProtocol)) !== null) {
      const structName = match[1];
      const structFieldsText = match[2] as string;
      const structFields = [];
      // 使用 ; 号分割
      const sentence = structFieldsText.replace(/\n/g, "").split(";");
      sentence.forEach((item) => {
        const currsentence = item.split(" ").filter((v) => v);
        if (!currsentence.length) {
          return;
        }
        const [tag, type, name] = currsentence;
        const obj = {
          tag,
          type,
          name,
        };
        structFields.push(obj);
      });

      lemon2node.structs[structName] = structFields;
    }

    // 使用正则表达式匹配方法名和参数请求  
    const regex = /rpc\s+(\w+)\s*\(([^()]+)\)\s*;+/g;  
    const matches = tlvProtocol.match(regex);  
      
    // 解析匹配结果并构建对象数组  
    const rpcMethods = matches.map(match => {  
        const [rpcName, argRequest] = match.split(/\s*\(([^()]+)\)\s*/);  
        const [, req, reqName, res, resName] = argRequest.match(/(\w+)\s+(\w+),\s*(\w.+)\s+(\w+)/);
        return { rpcName, req,reqName,res,resName };  
    });  
    
    lemon2node.rpcs = rpcMethods;

    lemon2node.CreateRender();
    // lemon2node.CreateJavaProtocol()
  }

  public async CreateRender(){
    let arrays = []
    for(let key in this.structs){
      arrays.push(this.createStruct (key,this.structs[key]))
      arrays.push(this.createRead   (key,this.structs[key]))
      arrays.push(this.createWrite  (key,this.structs[key]))
    }
    arrays.join('\n');
    const include = this.include.map(v=>`include ${v};`).join('\n')
    console.log(this.createClient());
    console.log('this.include',this.include);
    const includeSentence = include?this.include.map(v=>`import ${v} from './${v}'`).join('\n'):''
    const SetModule = include?this.include.map(v=>`${this.module}.${v} = ${v} as Record<string,JceStruct>`).join('\n'):''
    const formattedContent = await prettier.format(
      `
    // ${include}
    // module ${this.module};
import { T_Container, T_INT16, T_INT8, T_Map, T_String, T_Vector,T_Utils } from '../category';
import { DefineField, DefineStruct, Override } from '../decorator'
import { T_WStream,T_RStream } from '../stream/index'
import { JceStruct, ClinetProxy, Module } from "../type";
${includeSentence}

(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");
const ${this.module}:Module = {};

${SetModule}

    ${arrays.join('\n')}

    ${this.createClient()}
    ${this.createServer()}
export default ${this.module};

    
    `,
      { parser: 'typescript' }
    );
    fs.writeFileSync(`./bin/${this.module}.ts`,formattedContent,'utf-8')
  }

  private typeMap(type:string){
    if(type.startsWith('map')){
      type = type.replace('map','T_Map')
      return type
    }
    if(type.startsWith('vector')){
      type = type.replace('vector','T_Vector')
      return type
    }
    if(type == ("string")){
      type = "T_String";
      return type
    }
    if(type == ("int8")){
      type = "T_INT8";
      return type
    }
    if(type == ("int16")){
      type = "T_INT16";
      return type
    }
    if(type == ("int32")){
      type = "T_INT32";
      return type
    }
    if(type == ("int64")){
      type = "T_INT64";
      return type
    }
    return type;
  }

  private getMapType(type:string):[string,string]{
    const typeRegex = /map<(\w+),(\w+)>/;
    const match = typeRegex.exec(type);
    if (match) {
      const keyType = match[1];
      const valueType = match[2];
      return [this.typeMap(keyType),this.typeMap(valueType)];
    } else {
      throw new Error('No match found.')
    }
  }

  private getVectorType(type:string):string{
    const typeRegex = /vector<(\w+)>/;
    const match = typeRegex.exec(type);
    if (match) {
      const keyType = match[1];
      return keyType
    } else {
      throw new Error('No match found.')
    }
  }

  private createStruct(structName:string,obj:structFields):string{

    return `
const ${structName} = {
  _t_className : "${this.module}.Struct<${structName}>"
} as JceStruct;

T_Container.Set(${structName});

${this.module}.${structName} = ${structName};
`
  }

  private createWrite(structName:string,obj:structFields):string{
    const obj2Sentences = obj.map(v=>{
      if(v.type.startsWith('map<')){
        const [key,value] = this.getMapType(v.type)
        return `this.WriteMap(${v.tag}, T_Utils.Read2Object(obj,'${v.name}'),${key},${value});        `
      }
      if(v.type.startsWith('vector<')){
        const vectorType = this.getVectorType(v.type)
        return `this.WriteVector(${v.tag}, T_Utils.Read2Vector(obj,'${v.name}'), ${vectorType}.Write);`
      }
      if(v.type == "int8"){
        return `this.WriteInt8(${v.tag}, T_Utils.Read2Number(obj,'${v.name}'));`
      }
      if(v.type == "int16"){
        return `this.WriteInt16(${v.tag}, T_Utils.Read2Number(obj,'${v.name}'));`
      }
      if(v.type == "int32"){
        return `this.WriteInt32(${v.tag}, T_Utils.Read2Number(obj,'${v.name}'));`
      }
      if(v.type == "int64"){
        return `this.WriteInt64(${v.tag}, T_Utils.Read2Number(obj,'${v.name}'));`
      }
      if(v.type == "string"){
        return `this.WriteString(${v.tag}, T_Utils.Read2String(obj,'${v.name}'));`;
      }
      return `this.WriteStruct(${v.tag}, T_Utils.Read2Object(obj,'${v.name}'), ${v.type}.Write);`
    })
    const sentences = obj2Sentences.join('\n')
    return `
${structName}.Write = @DefineStruct(${structName}._t_className) class extends T_WStream{

  @Override public Serialize(obj){
    ${sentences}
    return this;
  }

}

  `
  }

  private createRead(structName:string,obj:structFields):string{
    const obj2Sentences = obj.map(v=>{
      if(v.type.startsWith('map<')){
        const [key,value] = this.getMapType(v.type)
        return `this.${v.name} = this.ReadMap(${v.tag},${key},${value});        `
      }
      if(v.type.startsWith('vector<')){
        const vectorType = this.getVectorType(v.type)
        return `this.${v.name} = this.ReadVector(${v.tag}, ${vectorType}.Read);`
      }
      if(v.type == "int8"){
        return `this.${v.name} = this.ReadInt8(${v.tag});`
      }
      if(v.type == "int16"){
        return `this.${v.name} = this.ReadInt16(${v.tag});`
      }
      if(v.type == "int32"){
        return `this.${v.name} = this.ReadInt32(${v.tag});`
      }
      if(v.type == "int64"){
        return `this.${v.name} = this.ReadInt64(${v.tag});`
      }
      if(v.type == "string"){
        return `this.${v.name} = this.ReadString(${v.tag});`;
      }
      return `this.${v.name} = this.ReadStruct(${v.tag}, ${v.type}.Read);`
    })
    const fieldsSentences = obj.map(v=>{
      return `@DefineField(${v.tag}) public ${v.name};`
    })
    const sentences = obj2Sentences.join('\n')
    const fieldSentences = fieldsSentences.join('\n')

    return `
${structName}.Read = @DefineStruct(${structName}._t_className) class extends T_RStream{
  
  ${fieldSentences};
  
  @Override public Deserialize(){
    ${sentences}
    return this;
  }

}
    `
  }

  private createClient(){
    const ModuleProxy = `Load${this.module}Proxy`
    const clientProxy = this.rpcs.map(v=>{
      const rpcMethodName = v.rpcName.replaceAll(' ','').substring(3);
      console.log('rpcMethodName',rpcMethodName);
      
      return `
      ${ModuleProxy}.prototype.${rpcMethodName} = function(data){
        return new Promise(resolve=>{
          (this.client as ClinetProxy).$InvokeRpc(this.module,'${rpcMethodName}',${this.module}.${v.req}._t_className as string,data).then(resp=>{
              resolve(resp)
          })
        })
      }
      `
    }).join('\n')
    console.log(clientProxy);
    
    return `
export const ${ModuleProxy} = function(client:ClinetProxy){
  this.client = client;
  this.module = '${this.module}';
};

${ModuleProxy}.module = '${this.module}';

${clientProxy}
    `
  };

  public createServer(){
    const ModuleServer = `Load${this.module}Server`;
    const ServerMethods = this.rpcs.map(v=>{
      const rpcMethodName = v.rpcName.replaceAll(' ','').substring(3);
      return `
      ${ModuleServer}.prototype.${rpcMethodName} = async function(ctx,req){
        throw new Error("Module Method has not implyment");        
      };
      `
    }).join('\n');
    const InitializeServer = this.rpcs.map(v=>{
      const rpcMethodName = v.rpcName.replaceAll(' ','').substring(3);
      return `
        T_Container.SetMethod(this.module,'${rpcMethodName}',this.${rpcMethodName}.bind(this));
        T_Container.SetRpcMethod('${rpcMethodName}',(${this.module} as any).${v.req}._t_className as string,(${this.module} as any).${v.res}._t_className as string);
        `
    }).join('\n')

    return `
    export const ${ModuleServer} = function(server){
      this.server = server;
      this.module = '${this.module}';
      this.TarsInitialize();
    }

    ${ModuleServer}.prototype.TarsInitialize = function(){
      ${InitializeServer}
    }
    ${ServerMethods}
    `
  }

  static Test = `
  function main(){
    const write_basicInfo = new BasicInfo.Write();
    const wbf = write_basicInfo.Serialize(
        {
            token:'1234',
            detail:{'a':'1','b':'2'}
        }
    ).toBuf()!;
    const read_basicInfo = new BasicInfo.Read(wbf).Deserialize().toObj()
    console.log(read_basicInfo);

    const write_pagination = new Pagination.Write();
    const wpg =  write_pagination.Serialize({
        offset:0,
        size:10,
        keyword:"hello world"
    }).toBuf()!;
    const read_pagination = new Pagination.Read(wpg).Deserialize().toObj()
    console.log(read_pagination);

    const write_user = new User.Write();
    const wus =  write_user.Serialize({
        id:0,
        name:'leemulus',
        age:12,
        phone:'12321412321',
        address:'wuhan'
    }).toBuf()!;
    const read_user = new User.Read(wus).Deserialize().toObj()
    console.log(read_user);
    

    const write_getuserreq = new getUserListReq.Write();
    const wgreq =  write_getuserreq.Serialize({
        basicInfo:{
            token:"qwe123asd123",
            detail:{
                a:"1",
                b:"2"
            }
        },
        page:{
            offset:0,
            size:10,
            keyword:"hello world"
        }
    }).toBuf()!;
    const rgreq = new getUserListReq.Read(wgreq).Deserialize().toObj()
    console.log(rgreq);

    const write_getuserres = new getUserListRes.Write();
    debugger;
    const wgres =  write_getuserres.Serialize({
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
            id:0,
            name:'leemulus',
            age:13,
            phone:'12321412321',
            address:'wuhan'
        },
        
    }).toBuf()!;
    debugger;
    const rgres = new getUserListRes.Read(wgres).Deserialize().toObj()
    console.log(rgres);
}

main();
`

  public async CreateJavaProtocol(){
    for(let v in this.structs){
      let ClassName = v;
      let values = this.structs[ClassName];
      let PublicFields = values.map(v=>{
        v._type = this.typeMap(v.type)
        return `public ${v._type} ${v.name};`;
      })
      let Constructor = values.map(v=>{
        return `this.${v.name} = (${v._type}) readStreamToObj.get("${v.name}");`
      })
      let Tag2Fields = values.map(v=>{
        return `this.Tag2Field.put(${v.tag}, "${v.name}");`
      })
      let Read = values.map(v=>{
          if(v.type.startsWith('map<')){
            const [key,value] = this.getMapType(v.type)
            return `this.${v.name} = this.ReadMap(${v.tag},${key},${value});        `
          }
          if(v.type.startsWith('vector<')){
            const vectorType = this.getVectorType(v.type)
            return `this.${v.name} = this.ReadVector(${v.tag}, ${vectorType}.Read);`
          }
          if(v.type == "int8"){
            return `this.${v.name} = this.ReadInt8(${v.tag});`
          }
          if(v.type == "int16"){
            return `this.${v.name} = this.ReadInt16(${v.tag});`
          }
          if(v.type == "int32"){
            return `this.${v.name} = this.ReadInt32(${v.tag});`
          }
          if(v.type == "int64"){
            return `this.${v.name} = this.ReadInt64(${v.tag});`
          }
          if(v.type == "string"){
            return `this.${v.name} = this.ReadString(${v.tag});`;
          }
          return `this.${v.name} = this.ReadStruct(${v.tag}, ${v.type}.class,T_Container.JCE_STRUCT.get(${v.type}._t_className).Read);`
      })
      let Write = values.map(v=>{
          if(v.type.startsWith('map<')){
            const [key,value] = this.getMapType(v.type)
            return `this.WriteMap(${v.tag}, obj.${v.name},${key},${value});        `
          }
          if(v.type.startsWith('vector<')){
            const vectorType = this.getVectorType(v.type)
            return `this.WriteVector(${v.tag}, obj.${v.name}, ${vectorType}.Write);`
          }
          if(v.type == "int8"){
            return `this.WriteInt8(${v.tag}, obj.${v.name}.GetValue());`
          }
          if(v.type == "int16"){
            return `this.WriteInt16(${v.tag}, obj.${v.name}.GetValue());`
          }
          if(v.type == "int32"){
            return `this.WriteInt32(${v.tag}, obj.${v.name}.GetValue());`
          }
          if(v.type == "int64"){
            return `this.WriteInt64(${v.tag}, obj.${v.name}.GetValue());`
          }
          if(v.type == "string"){
            return `this.WriteString(${v.tag}, obj.${v.name}.GetValue());`;
          }
          return `this.WriteStruct(${v.tag},  obj.${v.name}.GetValue(), T_Container.JCE_STRUCT.get(${v.type}._t_className).Write);`
      })
      const fileContent = (`
package dev_v3_0.protocol;
import dev_v3_0.protocol.*;
import dev_v3_0.category.*;
import dev_v3_0.stream.T_RStream;
import dev_v3_0.stream.T_WStream;

import java.lang.reflect.InvocationTargetException;
import java.nio.ByteBuffer;

public class ${ClassName} implements T_Base{
  public static String _t_className = "Struct<${ClassName}>";
  static {
    T_Container.JCE_STRUCT.put(${ClassName}._t_className, new T_JceStruct<${ClassName}.Read, ${ClassName}.Write,${ClassName}>(${ClassName}.Read.class, ${ClassName}.Write.class, ${ClassName}.class,${ClassName}._t_className));
  }
    ${PublicFields.join('\n    ')};

  public <T extends T_Base> ${ClassName}(T_Map<T> readStreamToObj){
    ${Constructor.join('\n    ')}
  }

  public ${ClassName}() {
    // NoArgsConstructor
  }

  @Override
  public T_Class __getClass__() {
    T_Class tc = new T_Class();
    tc.className = "Struct<${ClassName}>";
    tc.valueType = "${ClassName}";
    return tc;
  }


  @Override
  public ${ClassName} GetValue() {
      return this;
  }

  public static class Read extends T_RStream {
    ${PublicFields.join('\n    ')};

    public void ScanFields2Tag() {
      ${Tag2Fields.join('\n      ')};
    }

    public Read(ByteBuffer originBuf) {
        super(originBuf);
        this.ScanFields2Tag();
    }

    public Read DeSerialize() throws InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
      ${Read.join('\n      ')}  
      return this;
    }
  }

  public static class Write extends T_WStream {
    public Write Serialize(${ClassName} obj) throws Exception {
      ${Write.join('\n      ')}
      return this;
    }
  }
}

      
      `)
      fs.writeFileSync(`./bin/java/${ClassName}.java`,fileContent,'utf-8')
    }
  }


}

Lemon2Node.Compile()

