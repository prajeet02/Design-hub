import mongoose from "mongoose";

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  try {
    await mongoose.connect(MONGO_URI);
    console.log("connection to the database successful :)");
  } catch (error) {
    console.log("failed to connect to the database :(");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
