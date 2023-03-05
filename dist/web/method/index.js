"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proxy = exports.Post = exports.Get = exports.METHODS = void 0;
var routers_1 = require("../controller/routers");
var METHODS;
(function (METHODS) {
    METHODS["GET"] = "get";
    METHODS["POST"] = "post";
    METHODS["Proxy"] = "proxy";
})(METHODS = exports.METHODS || (exports.METHODS = {}));
var Get = function (url) {
    return function (value, context) {
        routers_1.routers.set({ url: url, method: METHODS.GET }, value);
    };
};
exports.Get = Get;
var Post = function (url) {
    return function (value, context) {
        routers_1.routers.set({ url: url, method: METHODS.POST }, value);
    };
};
exports.Post = Post;
var Proxy = function (url) {
    return function (value, context) {
        routers_1.routers.set({ url: url, method: METHODS.Proxy }, value);
    };
};
exports.Proxy = Proxy;
