"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    proxyService.transmit = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var key, Arc_ProxyInstance, buf, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(body);
                        key = body.key;
                        Arc_ProxyInstance = proxyService.MicroServices.get(key);
                        if (!Arc_ProxyInstance) return [3 /*break*/, 2];
                        buf = (0, call_1.call)(body);
                        return [4 /*yield*/, Arc_ProxyInstance.write(buf)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2: return [2 /*return*/, 0];
                }
            });
        });
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
                var proxy_instance = new proxy_1.ArcProxy(net.host, parseInt(net.port));
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
    proxyService.log = function () {
        return __awaiter(this, void 0, void 0, function () {
            var proxy_instance;
            return __generator(this, function (_a) {
                proxy_instance = new proxy_1.ArcProxy("127.0.0.1", parseInt("10012"));
                return [2 /*return*/];
            });
        });
    };
    return proxyService;
}());
exports.proxyService = proxyService;
