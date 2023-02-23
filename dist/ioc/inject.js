"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inject = void 0;
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
