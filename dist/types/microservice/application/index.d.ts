import { TarsusServer } from "./TarsusServer";
declare const ArcMethod: (value: any, context: ClassMethodDecoratorContext) => void;
declare const ArcInterFace: (interFace: string) => (classValue: any, context: ClassDecoratorContext) => void;
declare const ArcServerApplication: (port: number, host: string) => (value: any, context: ClassDecoratorContext) => void;
export { ArcInterFace, ArcServerApplication, ArcMethod, TarsusServer };
