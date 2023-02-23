"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConenction = void 0;
var ArcOrm_1 = require("./ArcOrm");
function getConenction() {
    return ArcOrm_1.ArcOrm.getConnection();
}
exports.getConenction = getConenction;
