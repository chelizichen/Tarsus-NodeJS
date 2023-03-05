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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TarsusProxy = void 0;
var net_1 = require("net");
var node_events_1 = require("node:events");
/**
 * @description 微服务接口代理层
 */
var TarsusProxy = /** @class */ (function () {
    function TarsusProxy(host, port) {
        this.uid = 1;
        this.java = false;
        this.intervalConnect = false;
        this.TarsusEvents = new node_events_1.EventEmitter();
        this.host = host;
        this.port = port;
        this.socket = new net_1.Socket();
        this.register_events();
        this.connect();
        this.key = TarsusProxy.createkey(host, port);
    }
    TarsusProxy.createkey = function (host, port) {
        return "-h ".concat(host, " -p ").concat(port);
    };
    TarsusProxy.prototype.register_events = function () {
        var _this = this;
        this.socket.on("connect", function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.clearIntervalConnect();
                console.log("connected to server", "TCP");
                return [2 /*return*/];
            });
        }); });
        this.socket.on("error", function (err) {
            console.log(err, "TCP ERROR");
            _this.launchIntervalConnect();
        });
        this.socket.on("close", function () {
            _this.launchIntervalConnect();
        });
        this.socket.on("end", function () {
            _this.launchIntervalConnect();
        });
        this.recieve_from_microService();
    };
    TarsusProxy.prototype.connect = function () {
        this.socket.connect({
            host: this.host,
            port: this.port,
        });
    };
    TarsusProxy.prototype.write = function (buf) {
        var _this = this;
        var len = Buffer.from(buf).byteLength;
        var new_buf = Buffer.allocUnsafe(len + 4);
        var new_str = "";
        if (this.java) {
            buf += "[#ENDL#]\n";
            new_str = this.join_buf(buf);
            this.socket.write(new_str, function (err) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (err) {
                        console.log(err);
                    }
                    return [2 /*return*/];
                });
            }); });
        }
        else {
            new_buf.writeUInt32BE(this.uid, 0);
            new_buf.write(buf, 4, "utf8");
            this.socket.write(new_buf, function (err) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (err) {
                        console.log(err);
                    }
                    return [2 /*return*/];
                });
            }); });
        }
        this.uid++;
    };
    TarsusProxy.prototype.join_buf = function (buf) {
        var len = String(this.uid).length;
        if (len == 1) {
            return "000" + this.uid + buf;
        }
        else if (len == 2) {
            return "00" + this.uid + buf;
        }
        else if (len == 3) {
            return "0" + this.uid + buf;
        }
        else if (len == 4) {
            return "" + this.uid + buf;
        }
    };
    TarsusProxy.prototype.recieve_from_microService = function () {
        var _this = this;
        this.socket.on("data", function (chunk) {
            var getId;
            var body;
            if (_this.java) {
                getId = Number.parseInt(chunk.subarray(0, 4).toString());
            }
            else {
                getId = chunk.readUInt32BE(0);
            }
            body = chunk.subarray(4, chunk.length);
            console.log(body.toString());
            _this.TarsusEvents.emit(getId.toString(), body.toString());
        });
    };
    TarsusProxy.prototype.recieve_from_client = function () { };
    TarsusProxy.prototype.launchIntervalConnect = function () {
        var _this = this;
        if (this.intervalConnect) {
            return;
        }
        this.intervalConnect = setInterval(function () { return _this.connect(); }, 5000);
    };
    TarsusProxy.prototype.clearIntervalConnect = function () {
        if (!this.intervalConnect) {
            return;
        }
        clearInterval(this.intervalConnect);
        this.intervalConnect = false;
    };
    return TarsusProxy;
}());
exports.TarsusProxy = TarsusProxy;
