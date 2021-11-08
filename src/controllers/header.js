"user strict";
let HeaderSchema = require("../models/header");
let fs = require("fs");

let controller = {
  save: (req, res) => {
    //Recolect params by post

    let params = req.body;
    //Validate data

    //Create object
    let headerSchema = new HeaderSchema();

    //Assign values

    headerSchema.description = params.description ? params.description : "";
    headerSchema.links = params.links ? params.links : {};
    //Save topic

    headerSchema.save((err, headerStored) => {
      if (err || !headerStored) {
        return res.status(500).send({
          status: "error",
          message: "Error al guardar el topic",
        });
      }

      //Return response
      return res.status(200).send({
        status: "success",
        headerStored,
      });
    });
  },

  getHeader: (req, res) => {
    //Find id by topic
    HeaderSchema.findOne().exec((err, header) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error getting the header.",
        });
      }

      if (!header) {
        return res.status(200).send({
          status: "error",
          message: "There are no records.",
          header: null,
        });
      }

      //Return response
      return res.status(200).send({
        status: 200,
        header,
      });
    });
  },

  update: (req, res) => {
    //Pick ip of topic
    let headerId = req.params.headerId;

    //Pick data from method POST
    var params = req.body;
    //Validate data

    //Set a json with the data
    let update = {
      description: params.description ? params.description : "",
      links: params.links ? params.links : {},
    };

    //Find and update of topic by id and user's id

    HeaderSchema.findOneAndUpdate(
      {
        _id: headerId,
      },
      update,
      {
        new: true,
      },
      (err, headerUpdated) => {
        if (err != null) {
          return res.status(500).send({
            status: "error",
            message: "Request error.",
          });
        }

        if (!headerUpdated) {
          return res.status(404).send({
            status: "error",
            message: "Failed to update the header.",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          header: headerUpdated,
        });
      }
    );
  },

  uploadImage: (req, res) => {
    var file_name = "Image not upload";
    if (Object.keys(req.files).length == 0) {
      return res.status(404).send({
        status: "error",
        message: file_name,
      });
    }

    try {
      // Get name and extension of file
      var file_path = req.files.file0.path;
      let file_split = file_path.split("/");
      //En linux is let file_split = file_path.split('/');
      var file_name = file_split[1]; //File extension

      let ext_split = file_name.split(".");
      var file_ext = ext_split[1];
      // Check extension, if not valid delete file
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error uploading image",
      });
    }

    if (
      file_ext != "png" &&
      file_ext != "jpg" &&
      file_ext != "jpeg" &&
      file_ext != "gif" &&
      file_ext != "webp"
    ) {
      fs.unlink(file_path, (err) => {
        return res.status(200).send({
          status: "error",
          message: "The file extension is not valid.",
        });
      });
    } else {
      // Get id from user identified

      let headerId = req.params.headerId;

      //FindOneAndupdate document

      HeaderSchema.findOneAndUpdate(
        {
          _id: headerId,
        },
        {
          image: file_name,
        },
        {
          new: true,
        },
        (err, headerUpdated) => {
          if (err || !headerUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error saving image.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            message: "Image uploaded",
            Header: headerUpdated,
          });
        }
      );
    }
  },
};

module.exports = controller;
