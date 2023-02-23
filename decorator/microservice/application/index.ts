import { TarsusServer } from "./TarsusServer";
import { TarsusEvent } from "./TarsusEvent";
import { Application,ApplicationEvents } from "../load";

const interFaceMap = new Map<string, Function>();
const interFaceSet = new Set<{
  func: any;
  method_name: string;
}>();

const ArcMethod = (value: any, context: ClassMethodDecoratorContext) => {
  interFaceSet.add({
    func: value,
    method_name: context.name as string,
  });
};

const ArcInterFace = (interFace: string) => {
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

const ArcServerApplication = (port: number, host: string) => {
  return function (value: any, context: ClassDecoratorContext) {
    context.addInitializer(() => {
        ApplicationEvents.on(Application.LOAD_INTERFACE, function (args: any[]) {
            args.forEach((el) => {
              console.log(el.name, "is load");
            });
          });

        ApplicationEvents.on(Application.LOAD_MICROSERVICE, function () {
            let arc_server = new TarsusServer({ port, host });
            arc_server.registEvents(interFaceMap);
            console.log(arc_server.ArcEvent.events);


            // TEST FUNCTION
            
            // setTimeout(async ()=>{
            //     const {from} = Buffer
            //     const data = await arc_server.ArcEvent.emit(from('[#1]DemoInterFace[#2]say'))
            //     console.log(data);
            // })
        });

    });
  };
};

export { ArcInterFace, ArcServerApplication, ArcMethod, TarsusServer };
