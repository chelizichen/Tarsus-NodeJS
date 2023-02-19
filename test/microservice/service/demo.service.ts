import { Service } from "../../../decorator/web/service";

@Service
class DemoService{
    TestDemo(){
        return "TestDemoService"
    }
}

export{
    DemoService
}