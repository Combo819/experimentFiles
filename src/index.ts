import { connectDB } from "./Database";
import { saveFilesInfo } from "./ParseFiles";
import {startServer} from './Server'

connectDB()
  .then((res) => {
    //saveFilesInfo();
    startServer()
  })
  .catch((err) => {
    console.log(err);
  });
