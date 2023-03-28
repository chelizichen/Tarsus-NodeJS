import { TarsusOberserver } from "../../web/ober/TarsusOberserver";

function Stream(request:string,response:string) {
  return function (value:(...args:any[])=>any,context:ClassMethodDecoratorContext) {
    context.addInitializer(function () {
      // @ts-ignore
      const getHead = `[#1]${this.interFace}[#2]${context.name}`;
      TarsusOberserver.StreamMap[getHead] = {
        request,
        response,
      };
    })
  }
}

export {
  Stream
}