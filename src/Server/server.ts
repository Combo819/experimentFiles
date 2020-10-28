import express from "express";
import { port } from "../config";
import { FileModel } from "../Database";

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

  app.listen(port, () => {
    console.log(`listening on port ${port} \n`);
  });
}

export { startServer };
