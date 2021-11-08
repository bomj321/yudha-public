"user strict";
let GeneralOptionsSchema = require("../models/generalOptions");
let fs = require("fs");

let controller = {
  save: (req, res) => {
    //Recolect params by post

    let params = req.body;
    //Validate data

    //Create object
    let generalOptionsSchema = new GeneralOptionsSchema();
    //Assign values

    generalOptionsSchema.wsNumber = params.wsNumber ? params.wsNumber : "";
    generalOptionsSchema.themeType = params.themeType
      ? params.themeType
      : "active-dark";

    generalOptionsSchema.showButton = params.showButton
      ? params.showButton
      : false;
    generalOptionsSchema.socialMedia = params.socialMedia
      ? params.socialMedia
      : {};
    generalOptionsSchema.styles = params.styles ? params.styles : {};
    //Save topic

    generalOptionsSchema.save((err, generalOptionsStored) => {
      if (err || !generalOptionsStored) {
        return res.status(500).send({
          status: "error",
          message: "Error saving the record",
        });
      }

      //Return response
      return res.status(200).send({
        status: "success",
        generalOptionsStored,
      });
    });
  },

  getGeneralOptions: (req, res) => {
    //Find id by topic
    GeneralOptionsSchema.findOne().exec((err, generalOptions) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error getting general options.",
        });
      }

      if (!generalOptions) {
        return res.status(200).send({
          status: "NOT_FOUND",
          generalOptions: null,
        });
      }

      //Return response
      return res.status(200).send({
        status: 200,
        generalOptions,
      });
    });
  },

  update: (req, res) => {
    //Pick ip of topic
    let generalOptionsId = req.params.generalOptionsId;

    //Pick data from method POST
    var params = req.body;
    //Validate data

    //Set a json with the data
    let update = {
      wsNumber: params.wsNumber ? params.wsNumber : "",
      themeType: params.themeType ? params.themeType : "active-dark",
      showButton: params.showButton ? params.showButton : false,
      socialMedia: params.socialMedia ? params.socialMedia : {},
      styles: params.styles ? params.styles : {},
    };

    //Find and update of topic by id and user's id

    GeneralOptionsSchema.findOneAndUpdate(
      {
        _id: generalOptionsId,
      },
      update,
      {
        new: true,
      },
      (err, generalOptionsUpdated) => {
        if (err != null) {
          return res.status(500).send({
            status: "error",
            message: "Request error.",
          });
        }

        if (!generalOptionsUpdated) {
          return res.status(404).send({
            status: "error",
            message: "Failed to update general options.",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          generalOptions: generalOptionsUpdated,
        });
      }
    );
  },

  uploadLogo: (req, res) => {
    var file_name = "Logo not upload";
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
      //En window is let file_split = file_path.split('\\');
      var file_name = file_split[1]; //File extension

      let ext_split = file_name.split(".");
      var file_ext = ext_split[1];

      // Check extension, if not valid delete file
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error uploading logo",
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

      let generalOptionsId = req.params.generalOptionsId;
      //FindOneAndupdate document

      GeneralOptionsSchema.findOneAndUpdate(
        {
          _id: generalOptionsId,
        },
        {
          systemLogo: file_name,
        },
        {
          new: true,
        },
        (err, generalOptionsUpdated) => {
          if (err || !generalOptionsUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error saving logo.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            message: "Logo uploaded",
            generalOptions: generalOptionsUpdated,
          });
        }
      );
    }
  },
};

module.exports = controller;
