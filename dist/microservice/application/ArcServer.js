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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArcServer = void 0;
var net_1 = require("net");
var ArcEvent_1 = require("./ArcEvent");
var pkg_1 = require("../pkg");
var ArcServer = /** @class */ (function () {
    function ArcServer(opts) {
        var port = opts.port, host = opts.host;
        this.createServer({ port: port, host: host });
        this.ArcEvent = new ArcEvent_1.ArcEvent();
        console.log("server start at " + host + ":" + port);
    }
    ArcServer.prototype.registEvents = function (events) {
        var _this = this;
        events.forEach(function (func, key) {
            _this.ArcEvent.register(key, func);
        });
    };
    ArcServer.prototype.createServer = function (_a) {
        var _this = this;
        var port = _a.port, host = _a.host;
        // 绑定this
        var bind_recieve = this.recieve.bind(this);
        var bind_connection = this.connection.bind(this);
        var bind_err = this.error.bind(this);
        this.Net = (0, net_1.createServer)(function (socket) {
            _this.socket = socket;
            _this.socket.on("data", bind_recieve);
            _this.socket.on("error", bind_err);
            _this.Net.on("connection", bind_connection);
        });
        this.Net.listen(port, host);
    };
    ArcServer.prototype.recieve = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var head_end, timeout, body_len, head, body, _body;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                console.log('接收到消息', data.toString());
                head_end = data.indexOf("[##]");
                timeout = Number(this.unpkgHead(2, data));
                body_len = Number(this.unpkgHead(3, data, true));
                head = data.subarray(0, data.indexOf(pkg_1.proto[2]));
                body = data.subarray(head_end + 4, body_len + head_end + 4);
                _body = this.unpacking(body);
                Promise.race([this.timeout(timeout), (_a = this.ArcEvent).emit.apply(_a, __spreadArray([head], _body, false))])
                    .then(function (res) {
                    var toJson = JSON.stringify(res);
                    _this.socket.write(toJson, function (err) {
                        if (err) {
                            console.log("服务端写入错误", err);
                        }
                        console.log("服务端写入成功");
                    });
                })
                    .catch(function (err) {
                    _this.socket.write(err, function (err) {
                        if (err) {
                            console.log("服务端写入错误", err);
                        }
                        console.log("服务端写入成功");
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    ArcServer.prototype.error = function (err) {
        console.log("ado-rpc-err", err);
    };
    ArcServer.prototype.connection = function () {
        console.log("有新用户链接");
    };
    /**
     *
     * @param pkg Buffer
     * @returns value:any[]
     * @description 拆包 根据 start 和 end 拆包
     */
    ArcServer.prototype.unpacking = function (buf) {
        var args = [];
        var init = 0;
        var start = buf.indexOf(pkg_1.size[init]);
        while (true) {
            var end_str = buf.subarray(start, start + 3).toString();
            var isEnd = end_str == pkg_1.size[pkg_1.size.length - 1];
            if (isEnd) {
                break;
            }
            var next = buf.indexOf(pkg_1.size[init + 1], start);
            if (next == -1) {
                var sub_pkg = buf.subarray(start, start + 6).toString();
                var is_un_pkg = sub_pkg == pkg_1.size[init] + pkg_1.size[0];
                // 判断是否为未分割的参数
                if (is_un_pkg) {
                    var un_pkg = buf.subarray(start + 3, buf.length - 3);
                    var getargs = this.unpacking(un_pkg);
                    args[init] = getargs;
                }
                else {
                    var un_pkg = buf.subarray(start + 3, buf.length - 3).toString();
                    args[init] = un_pkg;
                }
                break;
            }
            else {
                var isObject = buf.subarray(start, start + 6).toString() == pkg_1.size[init] + pkg_1.size[0];
                if (isObject) {
                    var end = buf.indexOf(pkg_1.size[pkg_1.size.length - 1] + pkg_1.size[init + 1]);
                    var un_pkg = buf.subarray(start + 3, end + 3);
                    var getargs = this.unpacking(un_pkg);
                    args[init] = getargs;
                    start = end + 3;
                }
                else {
                    var getargs = buf.subarray(start + 3, next).toString();
                    args[init] = getargs;
                    start = next;
                }
            }
            init++;
        }
        return args;
    };
    ArcServer.prototype.unpkgHead = function (start, data, end) {
        var start_index = data.indexOf(pkg_1.proto[start]);
        var start_next = 0;
        if (end) {
            start_next = data.indexOf(pkg_1.proto[pkg_1.proto.length - 1]);
        }
        else {
            start_next = data.indexOf(pkg_1.proto[start + 1]);
        }
        var timeout = data
            .subarray(start_index + pkg_1.proto[start].length, start_next)
            .toString("utf-8");
        return timeout;
    };
    ArcServer.prototype.timeout = function (time) {
        return new Promise(function (_, rej) {
            var _time = setTimeout(function () {
                rej("请求超时");
                clearTimeout(_time);
            }, time);
        });
    };
    return ArcServer;
}());
exports.ArcServer = ArcServer;
