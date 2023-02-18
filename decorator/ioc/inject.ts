import { IocMap } from "./collects";

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

export {
  Inject
}
