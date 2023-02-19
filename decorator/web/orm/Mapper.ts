import { IocMap } from "../../ioc/collects";

const Mapper = (value:new ()=>void,context:ClassDecoratorContext)=>{
    IocMap.set(value.name, new value());
}

export {
    Mapper
}