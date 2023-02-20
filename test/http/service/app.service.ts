import { Service } from "../../../decorator/web/service";

@Service
class AppService {

  hello() {
    console.log("AppService！！！！！！！！！！！！！！！！！");
  }

  static test(){
    
  }
}

export { AppService };