// const demo = [ 
//   "@DemoProxy/GateWay -l node -t @tarsus/http -h 127.0.0.1 -p 9811  -w 7"
//   // "TarsusTestNodeService -l java -t @tarsus/ms -h 127.0.0.1 -p 10012",
//   // "TarsusTestJavaService -l node -t @tarsus/ms -h 127.0.0.1 -p 7099",
//   // "TarsusHttpProject -l node -t @tarsus/http -h 127.0.0.1 -p 9811",
// ];

export type parseToObj = {
  language: "java" | "node",
  proto: "ms" | "http",
  host: string,
  port: string,
  serverName: string,
  serverProject:string,
  serverGroup:string,
  weight:string,
}

class ServantUtil {
  static params = [
    { key: "-l", param: "language" },
    { key: "-t", param: "proto" },
    { key: "-h", param: "host" },
    { key: "-p", param: "port" },
    { key: "-w", param: "weight" },
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
    obj['serverGroup'] = servant_name.slice(1,servant_name.indexOf("/"));
    obj['serverProject'] = servant_name.slice(servant_name.indexOf("/")+1);
    return obj
  }
}

// const data = ServantUtil.parse(demo[0])
// console.log(data);



export {
  ServantUtil
}