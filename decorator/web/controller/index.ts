import { readFileSync } from 'fs';
import express, { Express } from "express";
import { routers, controllers } from "./routers";
import { METHODS } from "../method";
import ArtTemplate from 'art-template'
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

        if(method == METHODS.VIEW){
          router.get(method_path, async (req,res) => {
            const ret = await value(req)
            let {data,template} = ret
            const after_render = ArtTemplate.render(template,data)
            if(!res.destroyed){
              res.end(after_render)
            }
          })
        }

      });
      routers.clear()
      controllers.add(router)
    });
  };
};


export { Controller };
