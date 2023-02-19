import { Service } from "../../decorator/web/service";

@Service
class AppService {

  hello() {
    console.log("hello world");
  }
}

export { AppService };