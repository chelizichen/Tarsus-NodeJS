import { TarsusProxy } from "../../web/proxy";
import { Response } from "express";
export declare class proxyService {
    static transmit(body: any, res: Response): number;
    static MicroServices: Map<string, TarsusProxy>;
    static boost(): void;
    static link_service(): void;
}
