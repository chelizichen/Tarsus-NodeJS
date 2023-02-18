import express from "express";
import { controllers } from "../controller/routers";

const ArcServer = (port:number) => {
  return function (value: any, context: ClassDecoratorContext) {
    context.addInitializer(() => {
      let app = express();

      controllers.forEach((value: any) => {
        app.use(value);
      });

      app.listen(port, function () {
        console.log("Server started at port: ", port);
      });
    })
  };

};

export {
  ArcServer
}