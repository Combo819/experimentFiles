"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileSchema = void 0;
var mongoose_1 = require("mongoose");
exports.fileSchema = new mongoose_1.Schema({
    fileName: { type: String, unique: true, required: true },
    path: { type: String, unique: true, required: true },
    experimentTime: { type: Date, required: true },
    channelSize: { type: Number, required: true },
    bubbleType: { type: String, required: true },
    waveType: { type: String, required: true },
    waveLength: { type: String, required: true },
    pressure: { type: Number, required: true },
    generatedTime: { type: Date, required: true },
    folderName: { type: String, required: true },
    folderDate: { type: Date, required: true },
});
var FileModel = mongoose_1.model("file", exports.fileSchema);
exports.default = FileModel;
