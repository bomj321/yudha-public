"user strict";

let validator = require("validator");
let HireSchema = require("../models/hire");
let fs = require("fs");

let controller = {
  save: (req, res) => {
    //Recolect params by post

    let params = req.body;
    //Validate data

    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_paragraph = !validator.isEmpty(params.paragraph);
      var validate_showForm = !validator.isEmpty(params.showForm);
    } catch (error) {
      return res.status(200).send({
        message: "Missing data to send.",
      });
    }

    if (validate_title && validate_paragraph && validate_showForm) {
      //Create object
      let hireSchema = new HireSchema();
      //Assign values

      hireSchema.title = params.title;
      hireSchema.paragraph = params.paragraph;
      hireSchema.showForm = params.showForm;
      //Save topic

      hireSchema.save((err, hireStored) => {
        if (err || !hireStored) {
          return res.status(500).send({
            status: "error",
            message: "Error saving the record",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          hireStored,
        });
      });
    } else {
      return res.status(200).send({
        message: "The data is not valid",
      });
    }
  },

  getHire: (req, res) => {
    //Find id by topic
    HireSchema.findOne().exec((err, hire) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error getting hire section.",
        });
      }

      if (!hire) {
        return res.status(200).send({
          status: "NOT_FOUND",
          hire: null,
        });
      }

      //Return response
      return res.status(200).send({
        status: 200,
        hire,
      });
    });
  },

  update: (req, res) => {
    //Pick ip of topic
    let hireId = req.params.hireId;
    //Pick data from method POST
    var params = req.body;
    //Validate data

    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_paragraph = !validator.isEmpty(params.paragraph);
      var validate_showForm = !validator.isEmpty(params.showForm);
    } catch (error) {
      return res.status(200).send({
        message: "Missing data to send.",
      });
    }

    if (validate_title && validate_paragraph && validate_showForm) {
      //Set a json with the data
      let update = {
        title: params.title,
        paragraph: params.paragraph,
        showForm: params.showForm,
      };

      //Find and update of topic by id and user's id

      HireSchema.findOneAndUpdate(
        {
          _id: hireId,
        },
        update,
        {
          new: true,
        },
        (err, hireUpdated) => {
          if (err != null) {
            return res.status(500).send({
              status: "error",
              message: "Request error.",
            });
          }

          if (!hireUpdated) {
            return res.status(404).send({
              status: "error",
              message: "Failed to update hire section.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            hire: hireUpdated,
          });
        }
      );
    } else {
      return res.status(200).send({
        message: "Data validation is not correct.",
      });
    }
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

      let hireId = req.params.hireId;

      //FindOneAndupdate document

      HireSchema.findOneAndUpdate(
        {
          _id: hireId,
        },
        {
          image: file_name,
        },
        {
          new: true,
        },
        (err, hireUpdated) => {
          if (err || !hireUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error saving image.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            message: "Image uploaded",
            hire: hireUpdated,
          });
        }
      );
    }
  },
};

module.exports = controller;
