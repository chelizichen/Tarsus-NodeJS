import { IocMap, LazyIocMap } from "./collects";

const Collect = (value: new () => void, context: ClassDecoratorContext) => {
  IocMap.set(value.name, new value());
};

const LazyCollect = (value:new()=>void,contenxt:ClassDecoratorContext)=>{
  LazyIocMap.set(value.name,value)
}

export {
  Collect,
  LazyCollect
}