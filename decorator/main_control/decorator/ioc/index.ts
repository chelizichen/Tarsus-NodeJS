
const ioc_config = {
    instance:new Map(),
}

const Collect = (value: new (...args:any[]) => void, context: ClassDecoratorContext) => {
    // get signal instance from prototype
    ioc_config.instance.set(value.prototype, new value());
};

const Inject = (injectAble: new (...args:any[]) => any) => {
    return (value: any, context: ClassFieldDecoratorContext) => {
        if (context.kind == "field") {
            return function () {
                let injectAbleClass = ioc_config.instance.get(injectAble.prototype);
                return injectAbleClass;
            };
        }
    };
};

export {
    Collect,Inject
}