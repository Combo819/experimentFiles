const path = require('path');
const URI = 'mongodb://localhost:27017/exp';
const pathPrefix = 'G:\\'
const basePath = path.resolve(pathPrefix,'camera data_montage');
const newBasePath =  path.resolve(pathPrefix,'montagePng'); 
const thumbnailBasePath = path.resolve(pathPrefix,'montageThumbnail');
const recordsPath = path.resolve(pathPrefix,'expFiles.json'); 
const port = 80;
export {URI,basePath,port,newBasePath,thumbnailBasePath,recordsPath};