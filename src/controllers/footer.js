"user strict";

let validator = require("validator");
let FooterSchema = require("../models/footer");
let fs = require("fs");

let controller = {
  save: (req, res) => {
    //Recolect params by post

    let params = req.body;
    //Validate data

    //Create object
    let footerSchema = new FooterSchema();
    //Assign values

    footerSchema.title = params.title ? params.title : "";
    footerSchema.email = params.email ? params.email : "";
    footerSchema.subTitle = params.subTitle ? params.subTitle : "";
    footerSchema.copyright = params.copyright ? params.copyright : "";
    footerSchema.showContact = params.showContact ? params.showContact : false;
    footerSchema.linkPages = params.linkPages ? params.linkPages : {};
    //Save topic

    footerSchema.save((err, footerStored) => {
      if (err || !footerStored) {
        return res.status(500).send({
          status: "error",
          message: "Error saving the record",
        });
      }

      //Return response
      return res.status(200).send({
        status: "success",
        footerStored,
      });
    });
  },

  getFooter: (req, res) => {
    //Find id by topic
    FooterSchema.findOne().exec((err, footer) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error getting footer section.",
        });
      }

      if (!footer) {
        return res.status(200).send({
          status: "NOT_FOUND",
          footer: null,
        });
      }

      //Return response
      return res.status(200).send({
        status: 200,
        footer,
      });
    });
  },

  update: (req, res) => {
    //Pick ip of topic
    let footerId = req.params.footerId;
    //Pick data from method POST
    var params = req.body;
    //Validate data

    //Set a json with the data
    let update = {
      title: params.title ? params.title : "",
      email: params.email ? params.email : "",
      subTitle: params.subTitle ? params.subTitle : "",
      copyright: params.copyright ? params.copyright : "",
      showContact: params.showContact ? params.showContact : false,
      linkPages: params.linkPages ? params.linkPages : {},
    };

    //Find and update of topic by id and user's id

    FooterSchema.findOneAndUpdate(
      {
        _id: footerId,
      },
      update,
      {
        new: true,
      },
      (err, footerUpdated) => {
        if (err != null) {
          return res.status(500).send({
            status: "error",
            message: "Request error.",
          });
        }

        if (!footerUpdated) {
          return res.status(404).send({
            status: "error",
            message: "Failed to update footer section.",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          footer: footerUpdated,
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

      let footerId = req.params.footerId;

      //FindOneAndupdate document

      FooterSchema.findOneAndUpdate(
        {
          _id: footerId,
        },
        {
          image: file_name,
        },
        {
          new: true,
        },
        (err, footerUpdated) => {
          if (err || !footerUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error saving image.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            message: "Image uploaded",
            footer: footerUpdated,
          });
        }
      );
    }
  },
};

module.exports = controller;
