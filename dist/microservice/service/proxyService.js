"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyService = void 0;
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var node_process_1 = require("node:process");
var call_1 = require("../utils/call");
var proxy_1 = require("../../web/proxy");
var proxyService = /** @class */ (function () {
    function proxyService() {
    }
    proxyService.transmit = function (body, res) {
        var key = body.key;
        var ProxyInstance = proxyService.MicroServices.get(key);
        if (ProxyInstance) {
            var str = (0, call_1.call)(body);
            var curr = String(ProxyInstance.uid);
            ProxyInstance.TarsusEvents.on(curr, function (args) {
                var _to_json_ = JSON.parse(args);
                if (!res.destroyed) {
                    res.json(_to_json_);
                }
            });
            ProxyInstance.write(str);
            // 为 EventEmitter 注册事件
        }
        else {
            return 0;
        }
    };
    proxyService.boost = function () {
        proxyService.link_service();
    };
    proxyService.link_service = function () {
        var cwd = process.cwd();
        var config_path = path_1.default.resolve(cwd, "server.json");
        var config = JSON.parse((0, fs_1.readFileSync)(config_path, "utf-8"));
        (0, node_process_1.nextTick)(function () {
            proxyService.MicroServices = new Map();
            config.servant.forEach(function (net) {
                var proxy_instance = new proxy_1.TarsusProxy(net.host, parseInt(net.port));
                var isJava = net.type == "java";
                if (isJava) {
                    proxy_instance.java = true;
                }
                var key = proxy_instance.key;
                console.log("key", key);
                proxyService.MicroServices.set(key, proxy_instance);
            });
        });
    };
    return proxyService;
}());
exports.proxyService = proxyService;
