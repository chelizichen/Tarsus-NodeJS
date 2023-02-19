import * as _ from 'lodash'

class class_transformer{
    static plainToClass<T extends new ()=>void>(plain:Record<string,any>,Class:T):InstanceType<T>{
        const inst = new Class();
        const ret_plain = _.assignIn(inst,plain)
        return ret_plain as InstanceType<T>
    }

    static classToPlain<T>(ClassInstance:T,filterKey:Array<keyof T>){
          const keys = Object.getOwnPropertyNames(ClassInstance);
          const get = keys
            .map((el:any) => {
              return filterKey.indexOf(el) == -1 ? el : undefined;
            })
            .filter((el) => el) as string[];
          return this.__classToPlain__(get, ClassInstance);
    }

    static __classToPlain__(get: string[], inst: any){
        const plain:Record<string,string> = {};
        get.forEach((el) => {
          plain[el] = inst[el];
        });
        return plain;
    }
}

// class TestClass{
//     name:string;
//     value:string;
//     age:string;
//     say(){
//         return this.name+this.age
//     }
// }

// const data = {
//     name:"1",
//     value:"2",
//     age:"3"
// }

// const ret = class_transformer.plainToClass(data,TestClass)
// console.log(ret.say);

// console.log(ret);

export {
    class_transformer
}