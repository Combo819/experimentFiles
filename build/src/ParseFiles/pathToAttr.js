"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathToAttr = void 0;
var lodash_1 = __importDefault(require("lodash"));
function pathToAttr(path) {
    var pathArr = path.split("/");
    if (pathArr.length !== 2) {
        throw new Error("the root path should start 2 level above the .tif files");
    }
    var folderName = pathArr[0];
    var fileName = pathArr[1];
    var folderAttrs = parseFolderName(folderName);
    var fileNameAttrs = parseFileName(fileName);
    lodash_1.default.forOwn(__assign(__assign({}, fileNameAttrs), folderAttrs), function (value, key) {
        if (!Boolean(value)) {
            throw new Error(path + " is not a valid path format");
        }
    });
    var channelSize = folderAttrs.channelSize, bubbleType = folderAttrs.bubbleType, waveLength = folderAttrs.waveLength, month = folderAttrs.month, date = folderAttrs.date;
    var waveType = fileNameAttrs.waveType, pressure = fileNameAttrs.pressure, dateExp = fileNameAttrs.dateExp, timeExp = fileNameAttrs.timeExp, dateGen = fileNameAttrs.dateGen;
    var experimentTime = new Date(dateExp.slice(0, 4) + "-" + dateExp.slice(4, 6) + "-" + dateExp.slice(6, 8) + " " + timeExp.slice(0, 2) + ":" + timeExp.slice(2, 4) + ":" + timeExp.slice(4, 6));
    var generatedTime = new Date(dateGen);
    var folderDate = new Date(date + " " + month + " " + generatedTime.getFullYear());
    return {
        fileName: fileName,
        path: path,
        experimentTime: experimentTime,
        generatedTime: generatedTime,
        channelSize: channelSize,
        bubbleType: bubbleType,
        waveLength: waveLength,
        waveType: waveType,
        pressure: pressure,
        folderName: folderName,
        folderDate: folderDate
    };
}
exports.pathToAttr = pathToAttr;
function parseFolderName(folderName) {
    var _a = lodash_1.default.toLower(folderName).split("_"), monthDate = _a[0], channelSizeStr = _a[1], bubbleTypeWaveLength = _a[2];
    var month = lodash_1.default.get(monthDate.match(/[0-9]+/), 0);
    var date = lodash_1.default.get(monthDate.match(/[a-z]+/), 0);
    var channelSize = parseInt(channelSizeStr);
    var bubbleType = (lodash_1.default.get(bubbleTypeWaveLength.match(/[A-Za-z]+/), 0));
    var waveLength = (lodash_1.default.get(bubbleTypeWaveLength.match(/[0-9]+/), 0));
    return { month: month, date: date, channelSize: channelSize, bubbleType: bubbleType, waveLength: waveLength };
}
function parseFileName(fileName) {
    var _a = lodash_1.default.toLower(fileName).split("_"), waveTypePressure = _a[0], dateExp = _a[1], timeExp = _a[2], tail = _a[3];
    var waveType = (lodash_1.default.get(waveTypePressure.match(/[a-z]+/), 0));
    var pressure = parseInt(lodash_1.default.get(waveTypePressure.match(/[0-9]+$/), 0));
    var dateGen = tail
        .replace("c001h001s000120", "")
        .replace(".tif", "");
    return { waveType: waveType, pressure: pressure, dateExp: dateExp, timeExp: timeExp, dateGen: dateGen };
}
