"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestFactory = void 0;
var axios_1 = __importDefault(require("axios"));
function createkey(port, host) {
    return "-h ".concat(host, " -p ").concat(port);
}
function RequestFactory(port, host) {
    var proxy_request = axios_1.default.create({
        timeout: 6000,
        headers: { "Content-Type": "application/json;charset=utf-8" },
        // 接口代理地址
        baseURL: "http://localhost:5005/api/proxy/interceptor",
        method: "post",
    });
    proxy_request.interceptors.request.use(function (config) {
        if (!config.headers) {
            throw new Error("Expected 'config' and 'config.headers' not to be undefined");
        }
        config.data.key = createkey(port, host);
        if (!config.data.timeout) {
            config.data.timeout = "3000";
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
    });
    return proxy_request;
}
exports.RequestFactory = RequestFactory;
