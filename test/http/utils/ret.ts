export class ret {
  static success<T>(data: T) {
    return {
      code:200,
      msg:"ok",
      data,
    };
  }
}
