import express, { Express } from "express";
import { routers, controllers } from "./routers";
import { METHODS } from "../method/index";
import ReactDom from 'react-dom/server'
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
          router.get(method_path, async (req, res) => {
            res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
            const ret = await value(req)
            const str = ReactDom.renderToString(ret);
            console.log(str);
            
            if (!res.destroyed) {
              res.write(str);
              res.end()
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
