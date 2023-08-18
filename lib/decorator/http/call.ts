
const call_config = {
    stream:require('tarsus-cli/taro').TarsusStream,
    parse:function (...args:any[]){
        return call_config.stream.parse(...args)
    },
}

export function call(pkg: any) {
    const { method, data, interFace, timeout,request } = pkg;

    console.log(call_config.stream);

    let _parse = call_config.parse({ req: request, data })
    // 处理头部字段
    let args = getArgs(_parse);

    let to_json = JSON.stringify(args)

    let body: Buffer = Buffer.from(to_json);

    let body_len = body.length;

    let head_str = getRequestHead(
        interFace,
        method,
        String(timeout),
        String(body_len),
        request
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


export let proto = ["1",
    "2", "3", "4", "5",
    "6", "7", "8", "9",
    "#"].map(item => {
    return "[#" + item + "]"
})

