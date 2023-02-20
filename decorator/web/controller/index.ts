import { readFileSync } from 'fs';
import express, { Express } from "express";
import { routers, controllers } from "./routers";
import { METHODS } from "../method";
import ArtTemplate from 'art-template'
import {cwd} from 'process'
import path from 'path'
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

        if(method == METHODS.VIEW){
          router.get(method_path, async (req,res) => {
            // const layout = path.join(cwd(),"public","views",interFace,url+".art")
            const ret = await value(req)
            // const read_file = readFileSync(layout,"utf-8")
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
