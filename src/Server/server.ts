import express from "express";
import { port } from "../config";
import { FileModel } from "../Database";
import { saveFilesInfo } from "../ParseFiles";
function startServer() {
  const app = express();
  app.use(express.urlencoded());
  app.use(express.json());
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
        res.send({ result });
      })
      .catch((err) => {
        res.status(400).send("failed to processing");
      });
  });

  app.post("/api/read", async (req: express.Request, res: express.Response) => {
    try {
      await saveFilesInfo();
      res.send({ result: "success" });
    } catch (err) {
      res.send({ result: "error" });
    }
  });

  app.listen(port, () => {
    console.log(`listening on port ${port} \n`);
  });
}

export { startServer };
