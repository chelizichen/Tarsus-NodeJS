import { IocMap } from "./collects";

const Collect = (value: new () => void, context: ClassDecoratorContext) => {
  IocMap.set(value.name, new value());
};

export {
  Collect
}