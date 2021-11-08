"use strict";

let mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
let app = require("./app");

const dotenv = require("dotenv");
dotenv.config();
// mongodb environment variables
const { MONGO_HOSTNAME, MONGO_DB, MONGO_PORT } = process.env;

const dbConnectionURL = {
  LOCALURL: `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`,
};

mongoose
  .connect(dbConnectionURL.LOCALURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(
      "Conexión a la base de datos ha sido establecida satisfactoriamente..."
    );

    // Creacion del servidor

    app.listen(8080, function () {
      console.log("up and running on port " + 8080);
    });
  })
  .catch((err) => console.log(err));
