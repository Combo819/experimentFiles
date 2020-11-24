import { Document, Model, model, Types, Schema, Query } from "mongoose";
export type FileAttr =  {
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
  bubblePersistance:number,
  bubbleNumber: number // -1->not input, 0-> no bubbles, 1->(1-5) bubbles , 2->(6-20), 3-> (20+)
  burst:number,
  cluster:number,
  valid: number, // -1->not input, 0->false, 1->true
  bubbleHandling: number // 0->false, 1->true. default 1, handling is ok
  channelDamage:number // 0->false, 1->true. default 0, no damage
  note: string // default empty string ""
  
}
export type IFile = Document & FileAttr;

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
  bubblePersistance:{type:Number,required:true},
  burst:{type:Number,required:true},
  cluster:{type:Number,required:true},
  valid:{type:Number,required:true},
  bubbleHandling:{type:Number,required:true},
  channelDamage:{type:Number,required:true},
  bubbleNumber:{type:Number,required:true},
  note:{type:String},
});

const FileModel: Model<IFile> = model("file", fileSchema);

export default FileModel;
