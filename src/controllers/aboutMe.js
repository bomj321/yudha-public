"user strict";
let AboutMeSchema = require("../models/aboutMe");
let fs = require("fs");

let controller = {
  save: (req, res) => {
    //Recolect params by post

    let params = req.body;
    //Validate data

    //Create object
    let aboutMeSchema = new AboutMeSchema();

    //Assign values

    aboutMeSchema.title = params.title ? params.title : "";
    aboutMeSchema.description = params.description ? params.description : "";
    //Save topic

    aboutMeSchema.save((err, aboutMeStored) => {
      if (err || !aboutMeStored) {
        return res.status(500).send({
          status: "error",
          message: "Error saving the information",
        });
      }

      //Return response
      return res.status(200).send({
        status: "success",
        aboutMeStored,
      });
    });
  },

  getAboutMe: (req, res) => {
    //Find id by topic
    AboutMeSchema.findOne().exec((err, aboutMe) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error getting the information.",
        });
      }

      if (!aboutMe) {
        return res.status(200).send({
          status: "error",
          aboutMe: null,
        });
      }

      //Return response
      return res.status(200).send({
        status: 200,
        aboutMe,
      });
    });
  },

  update: (req, res) => {
    //Pick ip of topic
    let aboutMeId = req.params.aboutMeId;

    //Pick data from method POST
    var params = req.body;
    //Validate data

    //Set a json with the data
    let update = {
      title: params.title ? params.title : "",
      description: params.description ? params.description : "",
    };

    //Find and update of topic by id and user's id

    AboutMeSchema.findOneAndUpdate(
      {
        _id: aboutMeId,
      },
      update,
      {
        new: true,
      },
      (err, aboutMeUpdated) => {
        if (err != null) {
          return res.status(500).send({
            status: "error",
            message: "Request error.",
          });
        }

        if (!aboutMeUpdated) {
          return res.status(404).send({
            status: "error",
            message: "Failed to update the information.",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          aboutMe: aboutMeUpdated,
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

      let aboutMeId = req.params.aboutMeId;

      //FindOneAndupdate document

      AboutMeSchema.findOneAndUpdate(
        {
          _id: aboutMeId,
        },
        {
          image: file_name,
        },
        {
          new: true,
        },
        (err, aboutMeUpdated) => {
          if (err || !aboutMeUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error saving image.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            message: "Image uploaded",
            aboutMe: aboutMeUpdated,
          });
        }
      );
    }
  },
};

module.exports = controller;
