"use strict";
var glob = require("glob");
var options = {
    cwd: "/home/combo/win/Desktop/montage"
};
// options is optional
//'April07_15um_native011'->monthDate_channelSize(number+"um")_bubbleType("native"|"filtered")+waveLength("011"|"51")
//s2000_20190407_190511_C001H001S00012025Oct2020.tif-> waveType("s"|"5s"|"p"|"5p"|"n"|"5n")+pressure(number)_dateExp(yyyymmdd)_timeExp(hhmmss)_C001H001S0001+DateGen(hhddMMM2020).tif
//experimentTime(secondPrecise),channelSize,bubbleType,waveLength,waveType,pressure,generatedTime(hourPrecise)
var files = glob.sync("**/*C001H001S00012025Oct2020.tif", options).map(function (item) { return item.split('/'); });
console.log(files);
