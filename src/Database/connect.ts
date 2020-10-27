import { ConnectionOptions, connect } from "mongoose";
import {URI} from '../config'


const connectDB = async () => {
  try {
    const mongoURI: string = URI;
    const options: ConnectionOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    };
    await connect(mongoURI, options);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export {connectDB} ;