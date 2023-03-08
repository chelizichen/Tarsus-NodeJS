declare const Inject: (injectAble: new () => any) => (value: any, context: ClassFieldDecoratorContext) => () => any;
declare const LazyInject: (injectAble: new () => any) => (value: any, context: ClassFieldDecoratorContext) => () => any;
export { Inject, LazyInject };
