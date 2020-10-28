import _ from "lodash";

interface FolderAttr {
  month: string;
  date: string;
  channelSize: number;
  bubbleType: "native" | "filtered";
  waveLength: "011" | "51";
}

interface FileNameAttr {
  waveType: "s" | "p" | "n";
  pressure: number;
  dateExp: string;
  timeExp: string;
  dateGen: string;
}

interface AllAttr {
  fileName: string;
  path: string;
  experimentTime: Date;
  channelSize: number;
  bubbleType: "native" | "filtered";
  waveType: "s" | "p" | "n";
  waveLength: string; //number like string
  pressure: number;
  generatedTime: Date;
  folderName: string;
  folderDate:Date;
}

function pathToAttr(path: string): AllAttr {
  const pathArr: string[] = path.split("/");
  if (pathArr.length !== 2) {
    throw new Error(`the root path should start 2 level above the .tif files`);
  }
  const folderName: string = pathArr[0];
  const fileName: string = pathArr[1];
  const folderAttrs: FolderAttr = parseFolderName(folderName);
  const fileNameAttrs: FileNameAttr = parseFileName(fileName);
  _.forOwn({ ...fileNameAttrs, ...folderAttrs }, (value, key) => {
    if (!Boolean(value)) {
      throw new Error(`${path} is not a valid path format`);
    }
  });
  const { channelSize, bubbleType, waveLength,month,date } = folderAttrs;
  const { waveType, pressure, dateExp, timeExp, dateGen } = fileNameAttrs;
  const experimentTime: Date = new Date(
    `${dateExp.slice(0, 4)}-${dateExp.slice(4, 6)}-${dateExp.slice(
      6,
      8
    )} ${timeExp.slice(0, 2)}:${timeExp.slice(2, 4)}:${timeExp.slice(4, 6)}`
  );
  const generatedTime: Date = new Date(dateGen);
  const folderDate:Date= new Date(`${date} ${month} ${generatedTime.getFullYear()}`);
  return {
    fileName,
    path,
    experimentTime,
    generatedTime,
    channelSize,
    bubbleType,
    waveLength,
    waveType,
    pressure,
    folderName,
    folderDate
  };
}

function parseFolderName(folderName: string): FolderAttr {
  const [monthDate, channelSizeStr, bubbleTypeWaveLength]: string[] = _.toLower(
    folderName
  ).split("_");
  const month: string = <string>_.get(monthDate.match(/[0-9]+/), 0);
  const date: string = <string>_.get(monthDate.match(/[a-z]+/), 0);
  const channelSize: number = parseInt(channelSizeStr);
  const bubbleType: "native" | "filtered" = <"native" | "filtered">(
    _.get(bubbleTypeWaveLength.match(/[A-Za-z]+/), 0)
  );
  const waveLength: "011" | "51" = <"011" | "51">(
    _.get(bubbleTypeWaveLength.match(/[0-9]+/), 0)
  );
  return { month, date, channelSize, bubbleType, waveLength };
}

function parseFileName(fileName: string): FileNameAttr {
  const [waveTypePressure, dateExp, timeExp, tail] = _.toLower(fileName).split(
    "_"
  );
  const waveType: "s" | "p" | "n" = <"s" | "p" | "n">(
    _.get(waveTypePressure.match(/[a-z]+/), 0)
  );
  const pressure: number = parseInt(
    <string>_.get(waveTypePressure.match(/[0-9]+$/), 0)
  );
  const dateGen: string = tail
    .replace("c001h001s000120", "")
    .replace(".tif", "");
  return { waveType, pressure, dateExp, timeExp, dateGen };
}

export {pathToAttr,AllAttr}