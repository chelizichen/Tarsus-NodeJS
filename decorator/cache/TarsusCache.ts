import { nextTick } from "process";
import { RedisClientType, createClient } from "redis";
import path from "path";
import { cwd } from "process";
import { ServantUtil } from "../util/servant";
import { TarsusProxyService } from "../web/service/TarsusProxyService";
import { TarsusProxy } from "../web/proxy";
import { TarsusLoadBalance } from "../gateway/LoadBalance";

class TarsusCache {
  RedisTemplate: RedisClientType;
  private config: Record<string, any>;
  private servantGroup:string;
  private servant:string[];

  constructor() {
    this.RedisTemplate = createClient();
    this.RedisTemplate.connect();
    const config_path = path.resolve(cwd(), "tarsus.config.js");
    this.config = require(config_path);
    // 微服务网关层可以通过对应的服务名拿到相关的服务（redis）
    // 修改后 变为 @TarsusGroup/ProjectName
    // 从分组里面拿到所有微服务
    this.servantGroup = ServantUtil.parse(this.config.servant.project[0]).serverGroup;
    // 可能也是微服务本身
    this.servant = this.config.servant.project;
    // 此时需要拿到对应的 微服务网网关层的服务名

  }

  // 微服务网关所需要的代理层
  public async getMsServer() {
    // 1 加载所有微服务模块
    // 2 对所有微服务模块进行分组

    nextTick(async () => {
      // 从redis 中读取 相关服务名，然后启动
      const data = await this.RedisTemplate.SMEMBERS(this.servantGroup);
      console.log("加载所有的微服务模块",data);
      
      let _groupMs:Record<string,Array<any>> = data.reduce((groups,obj)=>{
        let toObj = ServantUtil.parse(obj)
        const project = toObj.serverProject;

        if (!groups[project]) {
          groups[project] = [];
        }
      
        groups[project].push(toObj);
        return groups;
      },{})

      
      console.log('MsGroup',_groupMs);
      
      for(let v in _groupMs){
        const loadBalance = new TarsusLoadBalance(_groupMs[v],v);
        TarsusLoadBalance.setServant(v,loadBalance)
      }
    });
  }
  public async setServant(){
    // 这里修改为设置的 微服务分组 + 微服务全名
    // 类似 @DemoProxy/GateWay -l node -t @tarsus/http -h 127.0.0.1 -p 9811
    // 将会被设置为 DemoProxy  +  @DemoProxy/GateWay -l node -t @tarsus/http -h 127.0.0.1 -p 9811
    // 在得到所有微服务分组集合后，根据Seravant 链接 相关微服务
    this.RedisTemplate.sAdd(this.servantGroup,this.servant)
  }

}

export { TarsusCache };
