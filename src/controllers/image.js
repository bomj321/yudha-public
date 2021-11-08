"user strict";

let fs = require("fs");
let path = require("path");

let controller = {
  image: (req, res) => {
    let fileName = req.params.fileName;
    let pathFile = "./uploads/" + fileName;

    fs.exists(pathFile, (exists) => {
      if (exists) {
        return res.sendFile(path.resolve(pathFile));
      } else {
        return res.status(404).send({
          message: "This image doesn't exist",
        });
      }
    });
  },
};

module.exports = controller;
