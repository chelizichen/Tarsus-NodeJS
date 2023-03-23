import { proto, size } from "../pkg";

// @parmas { filed method data interFace timeout } pkg
export function call(pkg: any) {
  const { method, data, interFace, timeout } = pkg;
  // 处理头部字段
  let args = getRequestArgs(data); 
  let _tojson = JSON.stringify(args)

  let body: Buffer = Buffer.from(_tojson);

  let body_len = body.length;

  let head_str = getRequestHead(
    interFace,
    method,
    String(timeout),
    String(body_len)
  );

  let call_buf = head_str + body;
  

  return call_buf;
}

export function getRequestHead(...args: string[]): string {
  let head = "";

  args.forEach((item: string, index: number) => {
    head += proto[index] + item;
  });

  head += proto[proto.length - 1];

  return head;
}
/**
 * @deprecated 
 * 解析参数的算法搞的太失败了
 * 真的操了，还不如直接json
 */
export function getRequestArgs<
  K extends string | Record<string, any> | Array<any>
>(args: K): string {
  if (typeof args == "string") {
    return args;
  }

  if (args instanceof Array) {
    return JSON.stringify(args);
  }

  if (typeof args == "object") {
    let init = 0;
    let _args = "";
    // 装配参数
    for (let v in args) {
      let _ret = getRequestArgs(args[v] as any);
      _args += size[init++] + _ret;
    }
    _args += size[size.length - 1];

    // 尾部添加参数
    return _args;
  }
  return "";
}


export function getArgs(obj) {
  let arr = Object.values(obj).map((el) => {
    if (typeof el == "object" && el != null) {
      return getArgs(el);
    } else {
      return el;
    }
  });
  return arr;
}