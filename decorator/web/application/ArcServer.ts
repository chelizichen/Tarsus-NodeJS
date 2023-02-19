import express,{ Express } from "express";
import { controllers } from "../controller/routers";
import { Application, ApplicationEvents } from "./index";
import { ArcGlobalPipe } from "../pipe";

function loadController(args: Function[]) {
  args.forEach(el=>{
    console.log(el.name ," is  loader success", );
  })

  ApplicationEvents.emit(Application.LOAD_SERVER)
}

const ArcServer = (port: number) => {
  return function (value: any, context: ClassDecoratorContext) {
    context.addInitializer(() => {
      const app = express()
      
      // 优先执行
      ApplicationEvents.on(Application.LOAD_PIPE,function(args:Array<new ()=>ArcGlobalPipe>){
        args.forEach( pipe =>{
          let _pipe = new pipe()
          app.use("*",(req,res,next)=>_pipe.next(req,res,next))
        })
      })

      ApplicationEvents.on(Application.LOAD_SERVER, () => {
        // 下一次事件循环执行run server
        setImmediate(()=>{
          controllers.forEach((value: any) => {
            app.use(value);
          });
  
          app.listen(port, function () {
            console.log("Server started at port: ", port);
          });
        })
      });
    });
  };
};

export { ArcServer, loadController };
