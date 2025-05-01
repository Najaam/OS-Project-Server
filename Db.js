import mongoose from 'mongoose';
// const {dburl} =  require('./config');
const mongourl = "mongodb://localhost:27017/OSProject";

mongoose.connect(mongourl);

const db = mongoose.connection;

db.on('connected',() => {
    console.log("Connected to MongoDB");  
})

db.on('error',() => {    
    console.log("Error in connecting to MongoDB");
})

db.on('disconnected',() => {    
    console.log("MongoDB disconnected");
})

export default db;