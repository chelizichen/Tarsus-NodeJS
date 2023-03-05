/// <reference types="node" />
/// <reference types="node" />
import { Socket } from "net";
import { EventEmitter } from "node:events";
/**
 * @description 微服务接口代理层
 */
declare class TarsusProxy {
    static createkey(host: string, port: number): string;
    uid: number;
    java: boolean;
    socket: Socket;
    host: string;
    port: number;
    key: string;
    intervalConnect: any;
    _config_info_: any;
    TarsusEvents: EventEmitter;
    constructor(host: string, port: number);
    register_events(): void;
    connect(): void;
    write(buf: string): void;
    join_buf(buf: string): string;
    recieve_from_microService(): void;
    recieve_from_client(): void;
    launchIntervalConnect(): void;
    clearIntervalConnect(): void;
}
export { TarsusProxy };
