import { IocMap } from "../../ioc/collects";

// let EntitySet = new Set()

let EntityMap = new Map<string,typeof ColumnMap>()

let ColumnMap = new Map<string,string>()

const Entity = (table:string)=>{
    return function(value:new ()=>void,context:ClassDecoratorContext ){
        IocMap.set(value.name, new value());
        context.addInitializer(()=>{
            EntityMap.set(value.name,ColumnMap)
            ColumnMap.clear()
            console.log('EntityMap',EntityMap);
        })
    }
}

const Column = (field?:string|any,context?:ClassFieldDecoratorContext):any =>{

    // 有参数
    if(field && !context){
        return function(value:any,ctx:ClassFieldDecoratorContext){
            ctx.addInitializer(()=>{
                ColumnMap.set(ctx.name as string,field)
            })
        }
    }else{
        // 无参数
        context.addInitializer(()=>{
            ColumnMap.set(context.name as string,context.name as string)
        })
    }
}

// f

const Key = (value:any,context:ClassFieldDecoratorContext) => {

}

export {
    Entity,
    Column,
    EntityMap
}