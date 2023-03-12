import axios from "axios";

type target = {
  target: string;
  project: string;
}

// const data = await TarsusRequest.create("aaa","bbb").assemble("asd","123").assemble("123","asd")
// TarsusRequest.send({'project':"",'target':""},data);

class TarsusRequest {
  // 消息体
  private Body = new Map();
  // 数据
  private Data = new Map();

  constructor(interFace: string, method: string) {
    this.Body.set("interFace", interFace);
    this.Body.set("method", method);
  }
  public static create(interFace:string, method:string) {
    return new TarsusRequest(interFace, method);
  }

  public assemble(key, value) {
    this.Data.set(key, value);
    return this;
  }

  public payload() {
    this.Body.set("data", this.Data);
    return this.Body;
  }

  // data
  public static async send(target: target, data: TarsusRequest["Body"]) {
    return await axios({
      url: target.target,
      method: "post",
      data,
    });
  }
}


export { TarsusRequest };
