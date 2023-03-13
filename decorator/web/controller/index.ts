const Controller = (interFace: string) => {
  return function (controller: new () => any, context: ClassDecoratorContext) {
    controller.prototype.interFace = interFace;
    new controller()
  };
};


export { Controller };
