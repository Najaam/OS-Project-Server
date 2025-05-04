const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
// const swaggerJsDoc = require("swagger-jsdoc");
const { swaggerDefinition, paths } = require("../Helpers/swaggerdef");
const authroute = require("../Routes/Authroutes");

const app = express();
const PORT = 3000;

// Swagger options
const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [], // Not required as paths are manually added
};

// Manually add paths to Swagger docs
const swaggerDocs = {
  ...swaggerOptions.definition,
  paths,
};

// Middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res
    .status(200)
    .json("Welcome to the backend of Jade OS! Everything is running smoothly.");
});


// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/auth", authroute);

module.exports = app