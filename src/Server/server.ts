import express from "express";
import { port, basePath, newBasePath, thumbnailBasePath, recordsPath } from "../config";
import { FileAttr, FileModel, IFile, updateMany } from "../Database";
import { saveFilesInfo } from "../ParseFiles";
import cors from "cors";
import _ from "lodash";
import {Promise as PromiseBL} from "bluebird";
const path = require('path');
function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.static(newBasePath));
  app.use('/thumbnail', express.static(thumbnailBasePath));
  app.get("/api/dates", (req, res) => {
    FileModel.aggregate([
      {
        $project: {
          year: {
            $year: "$folderDate",
          },
          month: {
            $month: "$folderDate",
          },
          day: {
            $dayOfMonth: {
              date: "$folderDate",
              timezone: "America/Toronto",
            },
          },
          date: {
            $dateToString: {
              date: "$folderDate",
              timezone: "America/Toronto",
              format: "%Y-%m-%d",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            date: "$date",
          },
          dates: {
            $first: "$date",
          },
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]).exec((err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });

  app.get("/api/images", (req: express.Request, res: express.Response) => {
    const dateStr: string = <string>req.query.date;
    const date = new Date(dateStr);
    const nextDate = new Date(dateStr);
    nextDate.setDate(nextDate.getDate() + 1);
    FileModel.find({
      folderDate: { $gte: date, $lt: nextDate },
    })
      .exec()
      .then((result) => {
        result.forEach((item) => {
          _.omit(item, ["_id", "__v"]);
        });
        res.send({ result });
      })
      .catch((err) => {
        res.status(400).send("failed to processing");
      });
  });

  app.post('/api/update', async (req: express.Request, res: express.Response) => {
    const { id, field, value }: { id: any, field: string, value: number } = req.body;
    try {
      const file: IFile | null = await FileModel.findById(id);
      (file as any)[field] = value;
      await file?.save();
      res.send({ result: file });
    } catch (err) {
      console.log(err);
      res.send({ result: "error" });
    }
  })

  app.post("/api/read", async (req: express.Request, res: express.Response) => {

    try {
      await saveFilesInfo();
      res.send({ result: "success" });
    } catch (err) {
      res.send({ result: "error" });
    }
  });

  app.post("/api/updateRecords", async (req: express.Request, res: express.Response) => {
    //const records: FileAttr[] = req.body.records;
    try {
      const records: FileAttr[] = require(recordsPath);
      console.log(records)
      await updateMany(records, ['bubblePersistance',
        'burst',
        'cluster',
        'valid', 'bubbleHandling', 'channelDamage', 'note']);
      res.send({ result: 'success' })
    } catch (err) {
      console.log(err);
      res.send({ result: 'error' });
    }
  });

  //temporal method, copy field note to spectrum
  app.post('/api/copy-note',async (req: express.Request, res: express.Response) =>{
    try{
      const fileDocs = await FileModel.find({}).exec();
      await PromiseBL.each(fileDocs,async (fileDoc:IFile)=>{
        const note:string = fileDoc.note;
        fileDoc.spectrum = note;
        await fileDoc.save();
      });
      res.send('success')
    }catch(err){
      res.send('failed')
      console.log(err)
    }
  })

  app.use("/", express.static(path.resolve(__dirname, "../../frontend", "build")));


  app.listen(port, '0.0.0.0', () => {
    console.log(`listening on port ${port} \n`);
  });
}

export { startServer };
