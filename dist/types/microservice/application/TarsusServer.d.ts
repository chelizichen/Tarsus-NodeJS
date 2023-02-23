/// <reference types="node" />
/// <reference types="node" />
import { Server, Socket } from "net";
import { TarsusEvent } from "./TarsusEvent";
type ConnOpt = {
    port: number;
    host: string;
};
declare class TarsusServer {
    Net: Server;
    socket: Socket;
    ArcEvent: TarsusEvent;
    constructor(opts: ConnOpt);
    registEvents(events: Map<string, any>): void;
    createServer({ port, host }: ConnOpt): void;
    recieve(data: Buffer): Promise<void>;
    error(err: Error): void;
    connection(): void;
    /**
     *
     * @param pkg Buffer
     * @returns value:any[]
     * @description 拆包 根据 start 和 end 拆包
     */
    unpacking(buf: Buffer): any[];
    /**
     * @description 首部拆包得到字段
     * @param {number} start  根据协议头部定义得到相关字段
     * @summary 目前协议定义 1 interFace 接口 2 method 方法 3 timeout 超时时间 4 body_len 方法体的长度
     */
    unpkgHead(start: number, data: Buffer): string;
    unpkgHead(start: number, data: Buffer, end: boolean): string;
    timeout(time: number): Promise<unknown>;
}
export { TarsusServer };
