import glob, { IOptions } from "glob";
import { basePath,newBasePath,thumbnailBasePath } from "../config";
import { pathToAttr, FileAttr } from "./pathToAttr";
import { IFile, FileModel } from "../Database";
import {generatePng,generateThumbnail} from './generatePng'
const options: IOptions = {
  cwd: basePath,
};
// options is optional
//'April07_15um_native011'->monthDate_channelSize(number+"um")_bubbleType("native"|"filtered")+waveLength("011"|"51")
//s2000_20190407_190511_C001H001S00012025Oct2020.tif-> waveType("s"|"5s"|"p"|"5p"|"n"|"5n")+pressure(number)_dateExp_timeExp(hhmmss)_C001H001S0001+DateGen(hhddMMM2020).tif
//experimentTime(secondPrecise),channelSize,bubbleType,waveLength,waveType,pressure,generatedTime(hourPrecise)
function getFiles(): FileAttr[] {
  console.log(basePath);
  const files: string[] = glob.sync(
    "*/*.tif",
    options
  );
  const allFilesAttr: FileAttr[] = files.map((path) => pathToAttr(path));
  console.log(allFilesAttr[0]);
  return allFilesAttr;
}

function saveFilesInfo() {
  const filesInfo: FileAttr[] = getFiles();
  console.log(filesInfo.length)
  generatePng(filesInfo,basePath,newBasePath);
  generateThumbnail(filesInfo,basePath,thumbnailBasePath)
  return new Promise((resolve, reject) => {
     FileModel.collection.drop().catch((err) => {
      reject(err);
    }); 
    FileModel.insertMany(filesInfo, (err, docs) => {
      if (err && err.code !== 11000) {
        console.log(err);
        reject(err);
      } else {
        resolve();
        console.log(`insert successfully`);
      }
    });
  });
}

export { saveFilesInfo };
