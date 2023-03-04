const demo = [ 
  "TarsusTestNodeService -l java -t @tarsus/ms -h 127.0.0.1 -p 10012",
  // "TarsusTestJavaService -l node -t @tarsus/ms -h 127.0.0.1 -p 7099",
  // "TarsusHttpProject -l node -t @tarsus/http -h 127.0.0.1 -p 9811",
];

export type parseToObj = {
  language: "java" | "node",
  proto: "ms" | "http",
  host: string,
  port: string,
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
      let substr = servant.substring(index+2,end).trim()
      obj[param.param] = substr

      if(substr.endsWith("ms") && param.key == "-t"){
        obj[param.param] = "ms"
      }
      if(substr.endsWith("http") && param.key == "-t"){
        obj[param.param] = "http"
      }
    });

    let servant_end = servant.indexOf(" ")
    let servant_name = servant.substring(0,servant_end).trim()
    obj["serverName"] = servant_name;
    return obj
  }
}

// ServantUtil.parse(demo[0])



export {
  ServantUtil
}