import express, { Express } from "express";
import { routers, controllers } from "./routers";
import { METHODS } from "../method";

const Controller = (interFace: string) => {
  return function (controller: new () => void, context: ClassDecoratorContext) {
    let router = express();
    
    context.addInitializer(() => {
      routers.forEach((value: any, key) => {
        const { method, url } = key;
        value = value.bind(new controller())
        let method_path = interFace + url
        
        if (method == METHODS.GET) {
          router.get(method_path, async (req,res) => {
            const data = await value(req)
            res.json(data)
          });
        }

        if (method == METHODS.POST) {
          router.post(method_path, async (req, res) => {
            const data = await value(req);
            res.json(data);
          });
        }

      });
      
      routers.clear()

      controllers.add(router)
    });
  };
};


export { Controller };
