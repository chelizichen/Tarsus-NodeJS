export declare enum METHODS {
    GET = "get",
    POST = "post",
    Proxy = "proxy"
}
declare const Get: (url: string) => (value: any, context: ClassMethodDecoratorContext) => void;
declare const Post: (url: string) => (value: any, context: ClassMethodDecoratorContext) => void;
declare const Proxy: (url: string) => (value: any, context: ClassMethodDecoratorContext) => void;
export { Get, Post, Proxy };
