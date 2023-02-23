"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConenction = void 0;
var TarsusOrm_1 = require("./TarsusOrm");
function getConenction() {
    return TarsusOrm_1.TarsusOrm.getConnection();
}
exports.getConenction = getConenction;
