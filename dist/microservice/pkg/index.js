"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proto = exports.size = void 0;
// 数据包
exports.size = ["a",
    "b", "c", "d",
    "e", "f", "g", "h", "i",
    "j", "k", "l", "m",
    "n", "o", "p", "q", "r", 's',
    't', 'u', "v", "w", "x", "y",
    "z", "-", "=", "/", ".", ","].map(function (item) {
    return "#" + item + "#";
});
// 协议
exports.proto = ["1",
    "2", "3", "4", "5",
    "6", "7", "8", "9",
    "#"].map(function (item) {
    return "[#" + item + "]";
});
