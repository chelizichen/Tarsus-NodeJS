import { Request, Response, NextFunction } from "express";
interface ArcGlobalPipe {
    next(req: Request, res: Response, next: NextFunction): void;
}
declare function loadGlobalPipe(args: Array<new () => ArcGlobalPipe>): void;
export { ArcGlobalPipe, loadGlobalPipe };
