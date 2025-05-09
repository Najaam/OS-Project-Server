const express = require("express");
const cors = require("cors");
const authroute = require("../Routes/Authroutes");
const fileroute = require("../Routes/Filesystemroutes")
const fs = require("fs");

const app = express();
const PORT = 3000;



// Middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res
    .status(200)
    .json("Welcome to the backend of Jade OS! Everything is running smoothly.");
});





// Routes
app.use("/auth", authroute);
app.use("/api/file", fileroute);

module.exports = app