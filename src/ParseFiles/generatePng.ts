import { AllAttr } from "./pathToAttr";
import sharp from "sharp";
const path = require("path");
const fs = require("fs");

function generatePng(
  fileInfos: AllAttr[],
  basePath: string,
  newBasePath: string
) {
  fileInfos.forEach((fileInfo) => {
    const folderPath: string = path.resolve(newBasePath, fileInfo.folderName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    sharp(path.resolve(basePath, fileInfo.path))
      .toFile(
        path.resolve(folderPath, fileInfo.fileName.replace(".tif", ".png"))
      )
      .then((data: any) => {})
      .catch((err: Error) => {
        console.log(err);
      });
  });
}

function generateThumbnail(
  fileInfos: AllAttr[],
  basePath: string,
  newBasePath: string
) {
  fileInfos.forEach((fileInfo) => {
    const folderPath: string = path.resolve(newBasePath, fileInfo.folderName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    sharp(path.resolve(basePath, fileInfo.path))
      .resize(null, 120)
      .toFile(
        path.resolve(folderPath, fileInfo.fileName.replace(".tif", ".png"))
      )
      .then((data: any) => {})
      .catch((err: Error) => {
        console.log(err);
      });
  });
}

export { generatePng,generateThumbnail };
