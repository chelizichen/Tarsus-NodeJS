"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mapper = void 0;
var collects_1 = require("../../ioc/collects");
var Mapper = function (value, context) {
    collects_1.IocMap.set(value.name, new value());
};
exports.Mapper = Mapper;
