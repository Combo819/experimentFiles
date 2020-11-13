const path = require('path');
const URI = 'mongodb://localhost:27017/exp';
const pathPrefix = 'C:\\Users\\combo\\Desktop'
const basePath = path.resolve(pathPrefix,'montage');
const newBasePath =  path.resolve(pathPrefix,'montagePng'); 
const thumbnailBasePath = path.resolve(pathPrefix,'montageThumbnail');
const port = 80;
export {URI,basePath,port,newBasePath,thumbnailBasePath};