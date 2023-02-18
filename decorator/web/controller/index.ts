import express, { Express } from "express";
import { routers, controllers } from "./routers";
import { METHODS } from "../method";

const Controller = (interFace: string) => {
  return function (controller: new () => void, context: ClassDecoratorContext) {
    let router = express();
    
    context.addInitializer(() => {
      console.log(routers);
      
      routers.forEach((value: any, key) => {
        // value 是每个方法
        const { method, url } = key;

        value = value.bind(new controller())

        
        let method_path = interFace + url
        
        if (method == METHODS.GET) {
          router.get(method_path, async (req,res) => {
            
            const data = await value(req)
            if(!res.destroyed){
              res.json(data);
            }
          });
        }

        if (method == METHODS.POST) {
          router.post(method_path, async (req, res) => {
            const data = await value(req);
            if(!res.destroyed){
              res.json(data);
            }
          });
        }

      });
      routers.clear()
      controllers.add(router)
    });
  };
};


export { Controller };
