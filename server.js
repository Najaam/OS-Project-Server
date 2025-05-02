const express = require("express");
const cors = require("cors");
const db = require("./Db");
const authroute = require("./Routes/Authroutes");
const protectedroute = require("./Routes/Protectedroute");
const app = express();
const serverless = require('serverless-http');
const { port } = require("./config");
const PORT = port;



// Middleware
app.use(express.json());
app.use(cors());

// Root route
app.get("/", (req, res) => {
  res
    .status(200)
    .json("Welcome to the backend of Jade OS! Everything is running smoothly.");
});

// Routes
app.use("/auth", authroute);
app.use("/protected", protectedroute);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).send({
    error: "The requested resource was not found on this server.",
  });
});

// Start the server

module.exports.handler = serverless(app);