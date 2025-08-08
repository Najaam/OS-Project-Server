import mongoose from 'mongoose';

const mongourl = "mongodb+srv://test:test123@osproejct.vsjcopi.mongodb.net/?retryWrites=true&w=majority&appName=OSProejct";

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
