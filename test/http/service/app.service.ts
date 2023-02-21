import { Service } from "../../../decorator/web/service/index";

@Service
class AppService {

  hello() {
    console.log("AppService！！！！！！！！！！！！！！！！！");
  }

  static test(){
    
  }
}

export { AppService };