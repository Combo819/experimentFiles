import { Document, Model, model, Types, Schema, Query } from "mongoose";

export interface IFile extends Document {
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

export const fileSchema = new Schema({
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
  folderDate:{ type: Date, required: true },
});

const FileModel: Model<IFile> = model("file", fileSchema);

export default FileModel;
