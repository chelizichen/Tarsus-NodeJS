import { Service } from "../../../decorator/web/service/index";

@Service
class AppService {

  hello() {
    console.log("AppService！！！！！！！！！！！！！！！！！");
    return "123123"
  }

  static test(){
    
  }
}

export { AppService };