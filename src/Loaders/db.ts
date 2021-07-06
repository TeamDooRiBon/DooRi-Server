import mongoose from "mongoose";
import config from "../config"; 

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    console.log("Mongoose Connected ...");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
