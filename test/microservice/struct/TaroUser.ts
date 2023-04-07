const { TarsusReadStream } = require("tarsus-cli");
export class Basic {
  public token: string;
  constructor(...args: any[]) {
    const _TarsusReadStream = new TarsusReadStream("Basic", args);
    this.token = _TarsusReadStream.read_string(1);
  }
}
export class User {
  public id: string;
  public name: string;
  public age: string;
  public fullName: string;
  public address: string;
  constructor(...args: any[]) {
    const _TarsusReadStream = new TarsusReadStream("User", args);
    this.id = _TarsusReadStream.read_string(1);
    this.name = _TarsusReadStream.read_string(2);
    this.age = _TarsusReadStream.read_string(3);
    this.fullName = _TarsusReadStream.read_string(4);
    this.address = _TarsusReadStream.read_string(5);
  }
}
export class GetUserByIdReq {
  public id: number;
  public basic: Basic;
  constructor(...args: any[]) {
    const _TarsusReadStream = new TarsusReadStream("GetUserByIdReq", args);
    this.id = _TarsusReadStream.read_int(1);
    this.basic = _TarsusReadStream.read_struct(2, "Basic");
  }
}
export class GetUserByIdRes {
  public code: number;
  public data: User;
  public message: string;
  constructor(...args: any[]) {
    const _TarsusReadStream = new TarsusReadStream("GetUserByIdRes", args);
    this.code = _TarsusReadStream.read_int(1);
    this.data = _TarsusReadStream.read_struct(2, "User");
    this.message = _TarsusReadStream.read_string(3);
  }
}
export class GetUserListReq {
  public basic: Basic;
  public ids: Array<number>;
  constructor(...args: any[]) {
    console.log(args);
    const _TarsusReadStream = new TarsusReadStream("GetUserListReq", args);
    this.basic = _TarsusReadStream.read_struct(1, "Basic");
    this.ids = _TarsusReadStream.read_list(2, "List<int>");
  }
}
export class GetUserListRes {
  public code: number;
  public data: Array<User>;
  public message: string;
  constructor(...args: any[]) {
    const _TarsusReadStream = new TarsusReadStream("GetUserListRes", args);
    this.code = _TarsusReadStream.read_int(1);
    this.data = _TarsusReadStream.read_list(2, "List<User>");
    this.message = _TarsusReadStream.read_string(3);
  }
}
