"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityMap = exports.Column = exports.Entity = void 0;
var collects_1 = require("../../ioc/collects");
// let EntitySet = new Set()
var EntityMap = new Map();
exports.EntityMap = EntityMap;
var ColumnMap = new Map();
var Entity = function (table) {
    return function (value, context) {
        collects_1.IocMap.set(value.name, new value());
        context.addInitializer(function () {
            EntityMap.set(value.name, ColumnMap);
            ColumnMap.clear();
            console.log('EntityMap', EntityMap);
        });
    };
};
exports.Entity = Entity;
var Column = function (field, context) {
    // 有参数
    if (field && !context) {
        return function (value, ctx) {
            ctx.addInitializer(function () {
                ColumnMap.set(ctx.name, field);
            });
        };
    }
    else {
        // 无参数
        context.addInitializer(function () {
            ColumnMap.set(context.name, context.name);
        });
    }
};
exports.Column = Column;
// f
var Key = function (value, context) {
};
