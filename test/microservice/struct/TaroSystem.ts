const { TarsusReadStream } = require("tarsus-cli");
export class GetSystemLoadInfoReq {
    public host: string;
    public time: string;
    constructor(...args: any[]) {
        const _TarsusReadStream = new TarsusReadStream("GetSystemLoadInfoReq", args);
        this.host = _TarsusReadStream.read_string(1);
        this.time = _TarsusReadStream.read_string(2);
    }
};
export class GetSystemLoadInfoRes {
    public isAlive: number;
    public data: string;
    constructor(...args: any[]) {
        const _TarsusReadStream = new TarsusReadStream("GetSystemLoadInfoRes", args);
        this.isAlive = _TarsusReadStream.read_int(1);
        this.data = _TarsusReadStream.read_string(2);
    }
};
