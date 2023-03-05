"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadInit = exports.loadServer = exports.loadController = exports.TarsusHttpApplication = void 0;
var express_1 = __importDefault(require("express"));
var routers_1 = require("../controller/routers");
var index_1 = require("./index");
var process_1 = require("process");
var path_1 = __importDefault(require("path"));
var TarsusOrm_1 = require("../orm/TarsusOrm");
var servant_1 = require("../../util/servant");
var proxy_1 = require("../proxy");
var proxyService_1 = require("../../microservice/service/proxyService");
// import cluster from "cluster";
// import { cpus } from "os";
function loadController(args) {
    args.forEach(function (el) {
        console.log(el.name, " is  loader success");
    });
    index_1.ApplicationEvents.emit(index_1.Application.LOAD_SERVER);
}
exports.loadController = loadController;
function loadServer() {
    // 加载配置
    index_1.ApplicationEvents.emit(index_1.Application.LOAD_CONFIG);
    // 最后监听
    index_1.ApplicationEvents.emit(index_1.Application.LOAD_LISTEN);
}
exports.loadServer = loadServer;
// 初始化
function loadInit(callback) {
    index_1.ApplicationEvents.on(index_1.Application.LOAD_INIT, function (app) {
        callback(app);
    });
}
exports.loadInit = loadInit;
function loadMs(config) {
    (0, process_1.nextTick)(function () {
        proxyService_1.proxyService.MicroServices = new Map();
        config.servant.includes.forEach(function (servant) {
            var parsedServant = servant_1.ServantUtil.parse(servant);
            console.log(parsedServant);
            var proxy_instance = new proxy_1.TarsusProxy(parsedServant.host, Number(parsedServant.port));
            parsedServant.language == "java" ? (proxy_instance.java = true) : "";
            var key = proxy_instance.key;
            proxyService_1.proxyService.MicroServices.set(key, proxy_instance);
        });
    });
}
var TarsusHttpApplication = function (value, context) {
    context.addInitializer(function () {
        var app = (0, express_1.default)();
        app.use(express_1.default.json());
        // 加载配置文件
        var config_path = path_1.default.resolve((0, process_1.cwd)(), "tarsus.config.js");
        var _config = require(config_path);
        var SERVER = _config.servant.project;
        var parsedServer = servant_1.ServantUtil.parse(SERVER);
        var port = parsedServer.port || 8080;
        // 加载配置文件
        index_1.ApplicationEvents.on(index_1.Application.LOAD_CONFIG, function () {
            // 加载数据库
            index_1.ApplicationEvents.emit(index_1.Application.LOAD_DATABASE, _config);
            // 加载微服务
            // ApplicationEvents.emit(Application.LOAD_MS, _config);
        });
        // 加载数据库
        index_1.ApplicationEvents.on(index_1.Application.LOAD_DATABASE, TarsusOrm_1.TarsusOrm.CreatePool);
        index_1.ApplicationEvents.on(index_1.Application.LOAD_MS, loadMs);
        // 全局管道
        index_1.ApplicationEvents.on(index_1.Application.LOAD_PIPE, function (args) {
            args.forEach(function (pipe) {
                var _pipe = new pipe();
                app.use("*", function (req, res, next) { return _pipe.next(req, res, next); });
            });
        });
        // 加载路由
        index_1.ApplicationEvents.on(index_1.Application.LOAD_SERVER, function () {
            routers_1.controllers.forEach(function (value) {
                app.use(value);
            });
        });
        // 监听
        index_1.ApplicationEvents.on(index_1.Application.LOAD_LISTEN, function () {
            (0, process_1.nextTick)(function () {
                index_1.ApplicationEvents.emit(index_1.Application.LOAD_INIT, app);
                app.listen(port, function () {
                    console.log("Server started at port: ", port);
                    // 监听
                });
            });
        });
    });
};
exports.TarsusHttpApplication = TarsusHttpApplication;
