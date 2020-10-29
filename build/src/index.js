"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Database_1 = require("./Database");
var Server_1 = require("./Server");
Database_1.connectDB()
    .then(function (res) {
    //saveFilesInfo();
    Server_1.startServer();
})
    .catch(function (err) {
    console.log(err);
});
