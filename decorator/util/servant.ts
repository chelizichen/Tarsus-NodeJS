const demo = [
  "TarsusTestNodeService -l java -t @tarsus/ms -h 127.0.0.1 -p 10012",
  // "TarsusTestJavaService -l node -t @tarsus/ms -h 127.0.0.1 -p 7099",
  // "TarsusHttpProject -l node -t @tarsus/http -h 127.0.0.1 -p 9811",
];

type parseToObj = {
  language: "java" | "node",
  proto: "ms" | "http",
  host: string,
  port: number,
  serverName: string,
}

class ServantUtil {
  static params = [
    { key: "-l", param: "language" },
    { key: "-t", param: "type" },
    { key: "-h", param: "host" },
    { key: "-p", param: "port" },
  ];
  static parse(servant: string): parseToObj {
    let obj: parseToObj = {} as any;
    this.params.map((param) => {
      const index = servant.indexOf(param.key);
      let end = servant.indexOf(" ", index + 3);
      if (end == -1) {
        end = servant.length;
      }
      let substr = servant.substring(index+2,end)
      obj[param.param] = substr.trim()
    });

    let servant_end = servant.indexOf(" ")
    let servant_name = servant.substring(0,servant_end).trim()
    obj["serverName"] = servant_name;
    console.log("tt",obj)
    return obj
  }
}

ServantUtil.parse(demo[0])



export {
  ServantUtil
}