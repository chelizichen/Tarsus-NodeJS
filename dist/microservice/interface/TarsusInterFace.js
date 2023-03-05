"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TarsusMethod = exports.TarsusInterFace = exports.interFaceSet = exports.interFaceMap = void 0;
var TarsusEvent_1 = require("../application/TarsusEvent");
var interFaceMap = new Map();
exports.interFaceMap = interFaceMap;
var interFaceSet = new Set();
exports.interFaceSet = interFaceSet;
var TarsusMethod = function (value, context) {
    interFaceSet.add({
        func: value,
        method_name: context.name,
    });
};
exports.TarsusMethod = TarsusMethod;
var TarsusInterFace = function (interFace) {
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
exports.TarsusInterFace = TarsusInterFace;
