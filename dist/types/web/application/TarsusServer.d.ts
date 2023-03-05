import { Express } from "express";
declare function loadController(args: Function[]): void;
declare function loadServer(): void;
declare function loadInit(callback: (app: Express) => void): void;
declare const TarsusHttpApplication: (value: any, context: ClassDecoratorContext) => void;
export { TarsusHttpApplication, loadController, loadServer, loadInit };
