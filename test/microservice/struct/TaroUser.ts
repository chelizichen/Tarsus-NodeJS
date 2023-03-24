export class Basic {
  public token: string;
  constructor(...args: any[]) {
    this.token = args[1];
  }
};
export class User {
  public id: string;
  public name: string;
  public age: string;
  public fullName: string;
  public address: string;
  constructor(...args: any[]) {
    this.id = args[1];
    this.name = args[2];
    this.age = args[3];
    this.fullName = args[4];
    this.address = args[5];
  }
};
export class GetUserByIdReq {
  public id: number;
  public basic: Basic;
  constructor(...args: any[]) {
    this.id = args[1];
    this.basic = new Basic(...args[2])
  }
};
export class GetUserByIdRes {
  public code: number;
  public data: User;
  public message: string;
  constructor(...args: any[]) {
    this.code = args[1];
    this.data = new User(...args[2])
    this.message = args[3];
  }
};
export class GetUserListReq {
  public basic: Basic;
  public ids: Array<number>;
  constructor(...args: any[]) {
    this.basic = new Basic(...args[1])
    this.ids = JSON.parse(args[2]);
  }
};
export class GetUserListRes {
  public code: number;
  public data: Array<User>;
  public message: string;
  constructor(...args: any[]) {
    this.code = args[1];
    this.data = JSON.parse(args[2]).map(item => new User(...Object.values(item)));
    this.message = args[3];
  }
};
