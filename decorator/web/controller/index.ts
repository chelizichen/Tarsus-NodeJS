import express, { Express } from "express";
import { routers, controllers } from "./routers";
import { METHODS } from "../method/index";

const Controller = (interFace: string) => {
  return function (controller: new () => any, context: ClassDecoratorContext) {
    let router = express();
    
    context.addInitializer(() => {
      console.log(routers);
      
      routers.forEach((value: any, key) => {
        // value 是每个方法
        const { method, url } = key;
        const _controller = new controller()
        if(_controller.init){
          _controller.init()
        }
        value = value.bind(_controller)

        
        let method_path = interFace + url
        
        if (method == METHODS.GET) {
          console.log("Get ->>>>>> ",method_path );
          
          router.get(method_path, async (req, res) => {
            const data = await value(req)
            if(!res.destroyed){
              res.json(data);
            }
          });
        }

        if (method == METHODS.POST) {
          console.log("Post ->>>>>> ", method_path);
          router.post(method_path, async (req, res) => {
            const data = await value(req);
            if(!res.destroyed){
              res.json(data);
            }
          });
        }

        if (method == METHODS.Proxy) {
          console.log("Proxy ->>>>>> ", method_path);
          router.post(method_path, async (req, res) => {
            value(req,res)
          })
        }

      });
      routers.clear()
      controllers.add(router)
    });
  };
};


export { Controller };
