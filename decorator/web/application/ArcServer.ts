import express from "express";
import { controllers } from "../controller/routers";
import { Application, ApplicationEvents } from "./index";

function loaderClass(args: Function[]) {
  args.forEach(el=>{
    console.log(el.name ," is  loader success", );
  })
  ApplicationEvents.emit(Application.LOAD_SERVER)
}

const ArcServer = (port: number) => {
  return function (value: any, context: ClassDecoratorContext) {
    context.addInitializer(() => {
      ApplicationEvents.on(Application.LOAD_SERVER, () => {
        let app = express();

        controllers.forEach((value: any) => {
          app.use(value);
        });

        app.listen(port, function () {
          console.log("Server started at port: ", port);
        });
      });
    });
  };
};

export { ArcServer, loaderClass };
