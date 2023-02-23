"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = exports.Body = void 0;
/**
 * @description
 * typescript 5.0.0 暂不支持 ParamterDecorator
 */
function Query() {
    return function (value, context) {
        console.log("QUERY 装饰器");
    };
}
exports.Query = Query;
function Body() {
}
exports.Body = Body;
