import { DecoratorError } from "../http/error";

const IocContainer = {
    instance:new WeakMap(),
}

const Collect = (value: new (...args:any[]) => void, context: ClassDecoratorContext) => {
    IocContainer.instance.set(value, new value());
};

const Inject = (injectAble: new (...args:any[]) => any) => {
    return (value: any, context: ClassFieldDecoratorContext) => {
        if (context.kind !== "field") throw DecoratorError(`InjectError:  ${context.name as string} is not a field in class `) 
        return function () {
            let injectAbleClass = IocContainer.instance.get(injectAble);
            return injectAbleClass;
        };
    };
};

export {
    Collect,Inject,IocContainer
}