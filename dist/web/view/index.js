"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
var routers_1 = require("../controller/routers");
var method_1 = require("../method");
var View = function (url) {
    return function (value, context) {
        routers_1.routers.set({ url: url, method: method_1.METHODS.VIEW }, value);
    };
};
exports.View = View;
