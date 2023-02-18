import { routers } from "../controller/routers";

export enum METHODS{
  GET = "get",
  POST = "post"
}

const Get = (url: string) => {
  return (value: any, context: ClassMethodDecoratorContext) => {
    routers.set({ url, method: METHODS.GET }, value)
  };
};
const Post = (url: string) => {
  return (value: any, context: ClassMethodDecoratorContext) => {
    routers.set({ url, method: METHODS.GET }, value);
  };
};

export { Get, Post };
