import {FileModel,IFile,FileAttr} from '../';
import {Promise as PromiseBL} from "bluebird";
export function updateMany(arr:FileAttr[],fields:string[]){
    return PromiseBL.each(arr,async (item)=>{
        const fileDoc = await FileModel.findOne({path:item.path}).exec();
        fields.forEach((field:string)=>{
            (fileDoc as any)[field] = (item as any)[field];
        });
        await fileDoc?.save();
    });
}