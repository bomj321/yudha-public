"use strict";

//Requires
let express = require("express");
let bodyParser = require("body-parser");

//Execute express

let app = express();

//Load route's files

let image_routes = require("./routes/image");

let user_routes = require("./routes/user");
let generalOptions_routes = require("./routes/generalOptions");
let header_routes = require("./routes/header");
let aboutMe_routes = require("./routes/aboutMe");
let tab_routes = require("./routes/tab");
let awesomeService_routes = require("./routes/awesomeService");
let service_routes = require("./routes/service");
let latestProject_routes = require("./routes/latestProject");
let project_routes = require("./routes/project");

let latestNew_routes = require("./routes/latestNew");
let new_routes = require("./routes/new");
let hire_routes = require("./routes/hire");
let footer_routes = require("./routes/footer");
let router = express.Router();

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

//Rewrite Routes
app.use("/api", image_routes);

app.use("/api", user_routes);
app.use("/api", generalOptions_routes);
app.use("/api", header_routes);
app.use("/api", aboutMe_routes);
app.use("/api", tab_routes);
app.use("/api", awesomeService_routes);
app.use("/api", service_routes);
app.use("/api", latestProject_routes);
app.use("/api", project_routes);
app.use("/api", latestNew_routes);
app.use("/api", new_routes);
app.use("/api", hire_routes);
app.use("/api", footer_routes);

// will redirect all the non-api routes to react frontend
router.use(function (req, res) {
  res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
});

//Export Module
module.exports = app;
