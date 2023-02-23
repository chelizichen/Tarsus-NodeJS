import { TarsusProxy } from "../../web/proxy";
export declare class proxyService {
    static transmit(body: any): Promise<unknown>;
    static MicroServices: Map<string, TarsusProxy>;
    static boost(): void;
    static link_service(): void;
    static log(): Promise<void>;
}
