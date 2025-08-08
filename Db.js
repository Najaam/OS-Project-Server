import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config()
const mongourl = process.env.DB_URI;

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(mongourl);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error in connecting to MongoDB:", err.message);
    }
};

connectToMongoDB();
const db = mongoose.connection;

db.on('disconnected', () => {
    console.log("MongoDB disconnected");
});

export default db;
