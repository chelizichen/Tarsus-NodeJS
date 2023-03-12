import { IocMap, LazyIocMap } from "./collects";

const Inject = (injectAble: new () => any) => {
  return (value: any, context: ClassFieldDecoratorContext) => {
    if (context.kind == "field") {
      return function () {
        let injectAbleClass = IocMap.get(injectAble.prototype);
        return injectAbleClass;
      };
    }
  };
};

const LazyInject = (injectAble:new()=>any)=>{
  return (value: any, context: ClassFieldDecoratorContext) => {
    if (context.kind == "field") {
      return function () {
        let injectAbleClass = LazyIocMap.get(injectAble.prototype);
        // 确认是否被实例化
        if(injectAbleClass.prototype){
          let toInst = new injectAbleClass()
          LazyIocMap.set(injectAble.prototype,toInst)
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
