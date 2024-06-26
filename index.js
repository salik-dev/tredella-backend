require("dotenv").config();
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const router = require("./src/router");
const session = require("express-session");
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const errorController = require("./src/utils/errorController");
const AppError = require("./src/utils/appError");

const logger = require("morgan");

require("./src/utils/database");

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tredella-seller-portal.vercel.app",
    ], // Replace with your frontend origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
const server = http.createServer(app);

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(router);
app.all("*", (req, res, next) => {
  throw new AppError(`Requested Url not found!`, 404);
});

app.use(errorController);

const PORT = process.env.PORT;
server.listen(PORT, function () {
  console.log(`Server running on  *:${PORT} Process  ${process.pid} `);
});
