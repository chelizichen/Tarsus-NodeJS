"use strict";
// const demo = [ 
//   "TarsusTestNodeService -l java -t @tarsus/ms -h 127.0.0.1 -p 10012",
//   // "TarsusTestJavaService -l node -t @tarsus/ms -h 127.0.0.1 -p 7099",
//   // "TarsusHttpProject -l node -t @tarsus/http -h 127.0.0.1 -p 9811",
// ];
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServantUtil = void 0;
var ServantUtil = /** @class */ (function () {
    function ServantUtil() {
    }
    ServantUtil.parse = function (servant) {
        var obj = {};
        this.params.map(function (param) {
            var index = servant.indexOf(param.key);
            var end = servant.indexOf(" ", index + 3);
            if (end == -1) {
                end = servant.length;
            }
            var substr = servant.substring(index + 2, end).trim();
            obj[param.param] = substr;
            if (substr.endsWith("ms") && param.key == "-t") {
                obj[param.param] = "ms";
            }
            if (substr.endsWith("http") && param.key == "-t") {
                obj[param.param] = "http";
            }
        });
        var servant_end = servant.indexOf(" ");
        var servant_name = servant.substring(0, servant_end).trim();
        obj["serverName"] = servant_name;
        return obj;
    };
    ServantUtil.params = [
        { key: "-l", param: "language" },
        { key: "-t", param: "type" },
        { key: "-h", param: "host" },
        { key: "-p", param: "port" },
    ];
    return ServantUtil;
}());
exports.ServantUtil = ServantUtil;
