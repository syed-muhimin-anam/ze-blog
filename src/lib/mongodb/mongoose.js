import mongoose from "mongoose";

let initialized = false;

export const connect = async () => {
  mongoose.set('strictQuery', true);

  if (initialized) {
    console.log("Already connected to the database");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "ze-blog", // ✅ Corrected: added quotes
    });

    console.log("✅ Connected to the database");
    initialized = true;

  } catch (error) {
    console.error("❌ Error connecting to the database:", error);
  }
};
