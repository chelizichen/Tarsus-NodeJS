import { Collect } from "../../decorator/ioc";

@Collect
class AppService {

  hello() {
    console.log("hello world");
  }
}

export { AppService };