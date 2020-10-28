import glob, { IOptions } from "glob";
import { basePath } from "../config";
import { pathToAttr, AllAttr } from "./pathToAttr";
import { IFile, FileModel } from "../Database";
const options: IOptions = {
  cwd: basePath,
};
// options is optional
//'April07_15um_native011'->monthDate_channelSize(number+"um")_bubbleType("native"|"filtered")+waveLength("011"|"51")
//s2000_20190407_190511_C001H001S00012025Oct2020.tif-> waveType("s"|"5s"|"p"|"5p"|"n"|"5n")+pressure(number)_dateExp_timeExp(hhmmss)_C001H001S0001+DateGen(hhddMMM2020).tif
//experimentTime(secondPrecise),channelSize,bubbleType,waveLength,waveType,pressure,generatedTime(hourPrecise)
function getFiles(): AllAttr[] {
  const files: string[] = glob.sync(
    "**/*C001H001S00012025Oct2020.tif",
    options
  );
  const allFilesAttr: AllAttr[] = files.map((path) => pathToAttr(path));
  return allFilesAttr;
}

function saveFilesInfo() {
  const filesInfo: AllAttr[] = getFiles();
  FileModel.insertMany(filesInfo, (err, docs) => {
    if (err && err.code !== 11000) {
      console.log(err);
    } else {
      console.log(`insert successfully`);
    }
  });
}

export { saveFilesInfo };
