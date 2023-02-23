import { Request } from "express";
declare function UseInterCeptor(interceptor: TarsusInterCeptor): (value: any, context: ClassMethodDecoratorContext) => any;
interface TarsusInterCeptor {
    handle(req: Request): any;
}
export { UseInterCeptor, TarsusInterCeptor };
