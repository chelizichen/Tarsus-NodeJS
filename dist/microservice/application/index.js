"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TarsusServer = exports.ArcMethod = exports.ArcServerApplication = exports.ArcInterFace = void 0;
var TarsusServer_1 = require("./TarsusServer");
Object.defineProperty(exports, "TarsusServer", { enumerable: true, get: function () { return TarsusServer_1.TarsusServer; } });
var TarsusEvent_1 = require("./TarsusEvent");
var load_1 = require("../load");
var interFaceMap = new Map();
var interFaceSet = new Set();
var ArcMethod = function (value, context) {
    interFaceSet.add({
        func: value,
        method_name: context.name,
    });
};
exports.ArcMethod = ArcMethod;
var ArcInterFace = function (interFace) {
    return function (classValue, context) {
        // 每次遍历完都清除
        interFaceSet.forEach(function (method) {
            var func = method.func, method_name = method.method_name;
            func = func.bind(new classValue());
            var _method_name = TarsusEvent_1.TarsusEvent.get_fn_name(interFace, method_name);
            interFaceMap.set(_method_name, func);
        });
        interFaceSet.clear();
    };
};
exports.ArcInterFace = ArcInterFace;
var ArcServerApplication = function (port, host) {
    return function (value, context) {
        context.addInitializer(function () {
            load_1.ApplicationEvents.on(load_1.Application.LOAD_INTERFACE, function (args) {
                args.forEach(function (el) {
                    console.log(el.name, "is load");
                });
            });
            load_1.ApplicationEvents.on(load_1.Application.LOAD_MICROSERVICE, function () {
                var arc_server = new TarsusServer_1.TarsusServer({ port: port, host: host });
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
exports.ArcServerApplication = ArcServerApplication;
