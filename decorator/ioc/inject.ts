import { IocMap, LazyIocMap } from "./collects";

const Inject = (injectAble: new () => any) => {
  return (value: any, context: ClassFieldDecoratorContext) => {
    if (context.kind == "field") {
      return function () {
        let injectAbleClass = IocMap.get(injectAble.name);
        return injectAbleClass;
      };
    }
  };
};

const LazyInject = (injectAble:new()=>any)=>{
  return (value: any, context: ClassFieldDecoratorContext) => {
    if (context.kind == "field") {
      return function () {
        let injectAbleClass = LazyIocMap.get(injectAble.name);
        // 确认是否被实例化
        if(injectAbleClass.prototype){
          let toInst = new injectAbleClass()
          LazyIocMap.set(injectAble.name,toInst)
          return toInst
        }else{
          return injectAbleClass
        }
      };
    }
  };
}

export {
  Inject,LazyInject
}
