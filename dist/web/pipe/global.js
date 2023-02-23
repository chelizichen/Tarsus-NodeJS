"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadGlobalPipe = void 0;
var application_1 = require("../application");
function loadGlobalPipe(args) {
    application_1.ApplicationEvents.emit(application_1.Application.LOAD_PIPE, args);
}
exports.loadGlobalPipe = loadGlobalPipe;
