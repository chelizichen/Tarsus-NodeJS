# AweSome-TypeScript-Decorator

- Use TypeScript version 5.0.0-beta

````TS
npm install typescript@beta
````

## use ioc

````ts

// 收集依赖

@Collect
class AppService {
  hello() {
    console.log("hello world");
  }
}

// 注入依赖
class appController {
  @Inject(AppService)
  AppService!: AppService;

}
````

## use express http server

````TS
// controlelr
@Controller("/demo")
class demoController {
  @Inject(AppService)
  AppService!: AppService;

  @Inject(TestService)
  TestService!: TestService;

  @Get("/test")
  public test(req: Request) {
    const data = req.query;
    const ret = this.TestService.hello();

    return { data, ret };
  }

  @Get("/say")
  public say() {}
}
````

````TS
// Service
@Collect
class TestService {
  hello() {
    console.log("hello world");
    return "hello world"
  }
}
````

### run application

````TS
@ArcServer(9811)
class TestApplication{
  static main () :void {
    loaderClass([demoController]);
  }
}

TestApplication.main()
````

use POSTMAN to test

````txt
Get Request ->
localhost:9811/demo/test?data=111

return 
{
    "data": {
        "data": "111"
    },
    "ret": "hello world"
}

````
