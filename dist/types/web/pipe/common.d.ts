import { Request } from "express";
interface TarsusPipe {
    next(req: Request): void;
}
declare const UsePipe: () => void;
export { TarsusPipe, UsePipe };
