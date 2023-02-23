import { Request } from "express";
declare function UseInterCeptor(interceptor: ArcInterCeptor): (value: any, context: ClassMethodDecoratorContext) => any;
interface ArcInterCeptor {
    handle(req: Request): any;
}
export { UseInterCeptor, ArcInterCeptor };
