"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFilesInfo = void 0;
var glob_1 = __importDefault(require("glob"));
var config_1 = require("../config");
var pathToAttr_1 = require("./pathToAttr");
var Database_1 = require("../Database");
var options = {
    cwd: config_1.basePath,
};
// options is optional
//'April07_15um_native011'->monthDate_channelSize(number+"um")_bubbleType("native"|"filtered")+waveLength("011"|"51")
//s2000_20190407_190511_C001H001S00012025Oct2020.tif-> waveType("s"|"5s"|"p"|"5p"|"n"|"5n")+pressure(number)_dateExp_timeExp(hhmmss)_C001H001S0001+DateGen(hhddMMM2020).tif
//experimentTime(secondPrecise),channelSize,bubbleType,waveLength,waveType,pressure,generatedTime(hourPrecise)
function getFiles() {
    var files = glob_1.default.sync("**/*C001H001S00012025Oct2020.tif", options);
    var allFilesAttr = files.map(function (path) { return pathToAttr_1.pathToAttr(path); });
    return allFilesAttr;
}
function saveFilesInfo() {
    var filesInfo = getFiles();
    Database_1.FileModel.insertMany(filesInfo, function (err, docs) {
        if (err && err.code !== 11000) {
            console.log(err);
        }
        else {
            console.log("insert successfully");
        }
    });
}
exports.saveFilesInfo = saveFilesInfo;
