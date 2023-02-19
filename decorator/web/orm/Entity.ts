import { IocMap } from "../../ioc/collects";

const Entity = (table:string)=>{
    return function(value:new ()=>void,context:ClassDecoratorContext ){
        IocMap.set(value.name, new value());
    }
}

export {
    Entity
}