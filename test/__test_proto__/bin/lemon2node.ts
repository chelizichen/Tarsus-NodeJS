import fs from "fs";
import path from "path";
import prettier from 'prettier';

type structFields = Array<{tag:number,type:string,name:string;}>
type struct = Record<string,structFields>


class Lemon2Node {
  static includeRegex = /include\s+(\w+);/;
  static moduleRegex = /module\s+(\w+);/;
  static structRegex = /struct\s+(\w+)\s*{([^}]+)}/g;
  public include = [];
  public module = "";
  public structs = {};

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

    lemon2node.CreateRender()
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
    const formattedContent = await prettier.format(
      `
    // ${include}
    // module ${module};
import { T_Container, T_INT16, T_INT8, T_Map, T_String, T_Vector } from '../category';
import { DefineField, DefineStruct, Override } from '../decorator'
import { T_WStream,T_RStream } from '../stream/index'
import { JceStruct } from '../type';

(Symbol as { metadata: symbol }).metadata ??= Symbol("Symbol.metadata");
    ${arrays.join('\n')}


    ${Lemon2Node.Test}

    
    `,
      { parser: 'typescript' }
    );
    fs.writeFileSync('./bin/ample.ts',formattedContent,'utf-8')
  }

  private typeMap(type:string){
    if(type == ('map')){
      type = type.replace('map','T_Map')
      return type
    }
    if(type == ('vector')){
      type = type.replace('vector','T_Vector')
      return type
    }
    if(type == ("string")){
      type = "T_String";
      return type
    }
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
  _t_className : "Struct<${structName}>"
} as JceStruct
T_Container.Set(${structName});

`
  }

  private createWrite(structName:string,obj:structFields):string{
    const obj2Sentences = obj.map(v=>{
      if(v.type.startsWith('map<')){
        const [key,value] = this.getMapType(v.type)
        return `this.WriteMap(${v.tag},obj.${v.name},${key},${value});        `
      }
      if(v.type.startsWith('vector<')){
        const vectorType = this.getVectorType(v.type)
        return `this.WriteVector(${v.tag}, obj.${v.name}, ${vectorType}.Write);`
      }
      if(v.type == "int8"){
        return `this.WriteInt8(${v.tag}, obj.${v.name});`
      }
      if(v.type == "int16"){
        return `this.WriteInt16(${v.tag}, obj.${v.name});`
      }
      if(v.type == "int32"){
        return `this.WriteInt32(${v.tag}, obj.${v.name});`
      }
      if(v.type == "int64"){
        return `this.WriteInt64(${v.tag}, obj.${v.name});`
      }
      if(v.type == "string"){
        return `this.WriteString(${v.tag}, obj.${v.name});`;
      }
      return `this.WriteStruct(${v.tag}, obj.${v.name}, ${v.type}.Write);`
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


}

Lemon2Node.Compile()

