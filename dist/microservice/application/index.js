"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TarsusServer = exports.TarsusMsApplication = void 0;
var fs_1 = require("fs");
var process_1 = require("process");
var TarsusServer_1 = require("./TarsusServer");
Object.defineProperty(exports, "TarsusServer", { enumerable: true, get: function () { return TarsusServer_1.TarsusServer; } });
var load_1 = require("../load");
var path_1 = __importDefault(require("path"));
var servant_1 = require("../../util/servant");
var TarsusInterFace_1 = require("../interface/TarsusInterFace");
var TarsusMsApplication = function (value, context) {
    context.addInitializer(function () {
        var config_path = path_1.default.resolve((0, process_1.cwd)(), "tarsus.config.js");
        var _config = require(config_path);
        var SERVER = _config.servant.project;
        var parsedServer = servant_1.ServantUtil.parse(SERVER);
        var port = parsedServer.port || 8080;
        var host = parsedServer.host;
        console.log("parsedServer", parsedServer);
        load_1.ApplicationEvents.on(load_1.Application.LOAD_INTERFACE, function (args) {
            args.forEach(function (el) {
                console.log(el.name, "is load");
            });
        });
        load_1.ApplicationEvents.on(load_1.Application.REQUIRE_INTERFACE, function () {
            // 后续做处理
            var register_path = _config.servant.src || "src/register";
            var full_path = path_1.default.resolve((0, process_1.cwd)(), register_path);
            var dirs = (0, fs_1.readdirSync)(full_path);
            dirs.forEach(function (interFace) {
                var interFace_path = path_1.default.resolve(full_path, interFace);
                require(interFace_path);
            });
        });
        load_1.ApplicationEvents.on(load_1.Application.LOAD_MICROSERVICE, function () {
            var arc_server = new TarsusServer_1.TarsusServer({ port: Number(port), host: host });
            arc_server.registEvents(TarsusInterFace_1.interFaceMap);
            console.log(arc_server.ArcEvent.events);
            // TEST FUNCTION
            // setTimeout(async ()=>{
            //     const {from} = Buffer
            //     const data = await arc_server.ArcEvent.emit(from('[#1]DemoInterFace[#2]say'))
            //     console.log(data);
            // })
        });
    });
};
exports.TarsusMsApplication = TarsusMsApplication;
