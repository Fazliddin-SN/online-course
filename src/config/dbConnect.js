import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionParams = { useNewUrlParser: true };
    const connect = await mongoose.connect(
      process.env.CONNECTION_STRING ||
        "mongodb+srv://fazli:Sijj5i9JhpQGdSZC@cluster0.fdm38.mongodb.net/online-course"
    );
    console.log(
      `Database connected: ${connect.connection.host}, ${connect.connection.name}`,
      connectionParams
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
