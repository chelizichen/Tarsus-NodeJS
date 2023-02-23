/// <reference types="node" />
/// <reference types="node" />
import { Socket } from 'net';
/**
 * @description 微服务接口代理层
 */
declare class ArcProxy {
    static createkey(host: string, port: number): string;
    java: boolean;
    socket: Socket;
    host: string;
    port: number;
    key: string;
    intervalConnect: any;
    _config_info_: any;
    constructor(host: string, port: number);
    register_events(): void;
    connect(): void;
    write(buf: Buffer): Promise<unknown>;
    recieve_from_microService(): Promise<unknown>;
    recieve_from_client(): void;
    launchIntervalConnect(): void;
    clearIntervalConnect(): void;
}
export { ArcProxy };
