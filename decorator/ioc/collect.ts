import { IocMap, LazyIocMap } from "./collects";

const Collect = (value: new (...args:any[]) => void, context: ClassDecoratorContext) => {
  IocMap.set(value.prototype, new value());
};

const LazyCollect = (
  value: new (...args: any[]) => void,
  contenxt: ClassDecoratorContext
) => {
  LazyIocMap.set(value.prototype, value);
};

export {
  Collect,
  LazyCollect
}