import { Collect } from "../../decorator/ioc";

@Collect
class TestService {
  hello() {
    console.log("hello world");
    return "hello world"
  }
}

export { TestService };
