import { TarsusOberserver } from "../../web/ober/TarsusOberserver";
import { TarsusEvent } from "../application/TarsusEvent";

const interFaceMaps = new Map();
const TarsusEvents = TarsusOberserver.getEvents()

const TarsusMethod = (value: any, context: any) => {
  context.addInitializer(function () {
    const fn_name = TarsusEvent.get_fn_name(this.interFace, context.name);
    value = value.bind(this)
    TarsusEvents.register(fn_name, value)
  });
};

const TarsusInterFace = (interFace: string) => {
  return function (classValue: any, context: ClassDecoratorContext) {
    classValue.prototype.interFace = interFace;
  };
};

export { TarsusInterFace, TarsusMethod, interFaceMaps };