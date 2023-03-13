import { TarsusOberserver } from "../ober/TarsusOberserver";

export enum METHODS {
  GET = "get",
  POST = "post",
  Proxy = "proxy",
}

function createURL(interFace: string, method: string): string {
  if (!interFace.startsWith("/")) {
    interFace = "/" + interFace;
  }
  if (!method.startsWith("/")) {
    method = "/" + method
  }
  return interFace + method;
}

function MethodsFactory(type: METHODS) {
  return function (url: string) {
    let router = TarsusOberserver.router;
    return (func: any, context: ClassMethodDecoratorContext) => {
      context.addInitializer(function () {
        
        // @ts-ignore
        let current_route = createURL(this.interFace , url);

        func = func.bind(this);

        router[type](current_route, async (req, res) => {
          const data = await func(req);
          if (!res.destroyed) {
            res.json(data);
          }
        });
      });
    };
  };
}

const Get = MethodsFactory(METHODS.GET)
const Post = MethodsFactory(METHODS.POST)
const Proxy = (url: string) => {
  let router = TarsusOberserver.router;
  return (func: any, context: ClassMethodDecoratorContext) => {
    context.addInitializer(function () {
      func = func.bind(this);
      // @ts-ignore
      let current_route = this.interFace + url;
      router.all(current_route, async (req, res) => {
        func(req, res);
      });
    });
  };
};

export { Get, Post, Proxy };
