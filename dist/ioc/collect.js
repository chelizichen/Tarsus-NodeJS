"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collect = void 0;
var collects_1 = require("./collects");
var Collect = function (value, context) {
    collects_1.IocMap.set(value.name, new value());
};
exports.Collect = Collect;
