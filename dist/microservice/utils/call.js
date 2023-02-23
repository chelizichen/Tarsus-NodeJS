"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestArgs = exports.getRequestHead = exports.call = void 0;
var pkg_1 = require("../pkg");
// @parmas { filed method data interFace timeout } pkg
function call(pkg) {
    var method = pkg.method, data = pkg.data, interFace = pkg.interFace, timeout = pkg.timeout;
    // 处理头部字段
    var args = getRequestArgs(data);
    var body = Buffer.from(args);
    var body_len = body.length;
    var head_str = getRequestHead(interFace, method, String(timeout), String(body_len));
    var head = Buffer.from(head_str);
    var call_buf = Buffer.concat([head, body]);
    return call_buf;
}
exports.call = call;
function getRequestHead() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var head = "";
    args.forEach(function (item, index) {
        head += pkg_1.proto[index] + item;
    });
    head += pkg_1.proto[pkg_1.proto.length - 1];
    return head;
}
exports.getRequestHead = getRequestHead;
function getRequestArgs(args) {
    if (typeof args == "string") {
        return args;
    }
    if (args instanceof Array) {
        return JSON.stringify(args);
    }
    if (typeof args == "object") {
        var init = 0;
        var _args = "";
        // 装配参数
        for (var v in args) {
            var _ret = getRequestArgs(args[v]);
            _args += pkg_1.size[init++] + _ret;
        }
        _args += pkg_1.size[pkg_1.size.length - 1];
        // 尾部添加参数
        return _args;
    }
    return "";
}
exports.getRequestArgs = getRequestArgs;
