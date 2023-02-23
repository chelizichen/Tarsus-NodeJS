export declare enum METHODS {
    GET = "get",
    POST = "post",
    VIEW = "view"
}
declare const Get: (url: string) => (value: any, context: ClassMethodDecoratorContext) => void;
declare const Post: (url: string) => (value: any, context: ClassMethodDecoratorContext) => void;
export { Get, Post };
