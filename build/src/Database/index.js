"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.FileModel = void 0;
var file_1 = __importDefault(require("./Models/file"));
exports.FileModel = file_1.default;
var connect_1 = require("./connect");
Object.defineProperty(exports, "connectDB", { enumerable: true, get: function () { return connect_1.connectDB; } });
