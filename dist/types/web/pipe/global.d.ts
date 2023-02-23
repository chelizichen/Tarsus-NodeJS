import { Request, Response, NextFunction } from "express";
interface TarsusGlobalPipe {
    next(req: Request, res: Response, next: NextFunction): void;
}
declare function loadGlobalPipe(args: Array<new () => TarsusGlobalPipe>): void;
export { TarsusGlobalPipe, loadGlobalPipe };
