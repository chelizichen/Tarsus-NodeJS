"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyInject = exports.Inject = void 0;
var collects_1 = require("./collects");
var Inject = function (injectAble) {
    return function (value, context) {
        if (context.kind == "field") {
            return function () {
                var injectAbleClass = collects_1.IocMap.get(injectAble.name);
                return injectAbleClass;
            };
        }
    };
};
exports.Inject = Inject;
var LazyInject = function (injectAble) {
    return function (value, context) {
        if (context.kind == "field") {
            return function () {
                var injectAbleClass = collects_1.LazyIocMap.get(injectAble.name);
                // 确认是否被实例化
                if (injectAbleClass.prototype) {
                    var toInst = new injectAbleClass();
                    collects_1.LazyIocMap.set(injectAble.name, toInst);
                    return toInst;
                }
                else {
                    return injectAbleClass;
                }
            };
        }
    };
};
exports.LazyInject = LazyInject;
