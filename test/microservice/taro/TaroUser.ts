class Basic {
  public token: string = null;
  constructor(...args: any[]) {
    this.token = args[1];
  }
}
class User {
  public id: string = null;
  public name: string = null;
  public age: string = null;
  public fullName: string = null;
  public address: string = null;
  constructor(...args: any[]) {
    this.id = args[1];
    this.name = args[2];
    this.age = args[3];
    this.fullName = args[4];
    this.address = args[5];
  }
}
class GetUserByIdReq {
  public id: number = null;
  public basic: Basic = null;
  constructor(...args: any[]) {
    this.id = args[1];
    this.basic = new Basic(...args[2]);
  }
}
class GetUserByIdRes {
  public code: number = null;
  public data: User = null;
  public message: string = null;
  constructor(...args: any[]) {
    this.code = args[1];
    this.data = new User(...args[2]);
    this.message = args[3];
  }
}
class GetUserListReq {
  public basic: Basic = null;
  public ids: Array<number> = null;
  constructor(...args: any[]) {
    this.basic = new Basic(...args[1]);
    this.ids = JSON.parse(args[2]);
  }
}
class GetUserListRes {
  public code: number = null;
  public data: Array<User> = null;
  public message: string = null;
  constructor(...args: any[]) {
    this.code = args[1];
    this.data = JSON.parse(args[2]).map(
      (item) => new User(...Object.values(item))
    );
    this.message = args[3];
  }
}
