import { Request } from "express";
interface ArcPipe {
    next(req: Request): void;
}
declare const UsePipe: () => void;
export { ArcPipe, UsePipe };
