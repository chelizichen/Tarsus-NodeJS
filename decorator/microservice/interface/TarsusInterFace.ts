import { TarsusEvent } from "../application/TarsusEvent";

const interFaceMap = new Map<string, Function>();
const interFaceSet = new Set<{
  func: any;
  method_name: string;
}>();

const TarsusMethod = (value: any, context: ClassMethodDecoratorContext) => {
  interFaceSet.add({
    func: value,
    method_name: context.name as string,
  });
};

const TarsusInterFace = (interFace: string) => {
  return function (classValue: any, context: ClassDecoratorContext) {
    // 每次遍历完都清除
    interFaceSet.forEach((method) => {
      let { func, method_name } = method;
      func = func.bind(new classValue());
      const _method_name = TarsusEvent.get_fn_name(interFace, method_name);
      interFaceMap.set(_method_name, func);
    });
    interFaceSet.clear();
  };
};

export{
    interFaceMap,
    interFaceSet,
    TarsusInterFace,
    TarsusMethod
}