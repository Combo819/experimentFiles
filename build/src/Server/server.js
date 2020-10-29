"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
var express_1 = __importDefault(require("express"));
var config_1 = require("../config");
var Database_1 = require("../Database");
function startServer() {
    var app = express_1.default();
    app.use(express_1.default.urlencoded());
    app.use(express_1.default.json());
    app.get("/api/dates", function (req, res) {
        Database_1.FileModel.aggregate([
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
        ]).exec(function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(result);
            }
        });
    });
    app.listen(config_1.port, function () {
        console.log("listening on port " + config_1.port + " \n");
    });
}
exports.startServer = startServer;
