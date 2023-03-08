var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// decorator/microservice/load/index.ts
var load_exports = {};
__export(load_exports, {
  Application: () => Application,
  ApplicationEvents: () => ApplicationEvents,
  loadInterFace: () => loadInterFace,
  loadMicroService: () => loadMicroService
});
module.exports = __toCommonJS(load_exports);
var import_node_events = require("events");
var ApplicationEvents = new import_node_events.EventEmitter();
var Application = /* @__PURE__ */ ((Application2) => {
  Application2["LOAD_INTERFACE"] = "loadinterface";
  Application2["LOAD_MICROSERVICE"] = "loadmicroservice";
  Application2["GET_INTERFACE"] = "getinterface";
  Application2["REQUIRE_INTERFACE"] = "require_interface";
  return Application2;
})(Application || {});
function loadMicroService() {
  ApplicationEvents.emit("loadmicroservice" /* LOAD_MICROSERVICE */);
}
function loadInterFace(args) {
  if (args) {
    ApplicationEvents.emit("loadinterface" /* LOAD_INTERFACE */, args);
  } else {
    ApplicationEvents.emit("require_interface" /* REQUIRE_INTERFACE */);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Application,
  ApplicationEvents,
  loadInterFace,
  loadMicroService
});
