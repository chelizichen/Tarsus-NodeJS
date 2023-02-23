"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.class_transformer = void 0;
var _ = __importStar(require("lodash"));
var class_transformer = /** @class */ (function () {
    function class_transformer() {
    }
    class_transformer.plainToClass = function (plain, Class) {
        var inst = new Class();
        var ret_plain = _.assignIn(inst, plain);
        return ret_plain;
    };
    class_transformer.classToPlain = function (ClassInstance, filterKey) {
        var keys = Object.getOwnPropertyNames(ClassInstance);
        var get = keys
            .map(function (el) {
            return filterKey.indexOf(el) == -1 ? el : undefined;
        })
            .filter(function (el) { return el; });
        return this.__classToPlain__(get, ClassInstance);
    };
    class_transformer.__classToPlain__ = function (get, inst) {
        var plain = {};
        get.forEach(function (el) {
            plain[el] = inst[el];
        });
        return plain;
    };
    return class_transformer;
}());
exports.class_transformer = class_transformer;
