"user strict";
let validator = require("validator");
let NewSchema = require("../models/new");
let fs = require("fs");

let controller = {
  save: (req, res) => {
    //Recolect params by post
    let params = req.body;
    //Validate data

    try {
      var validate_bannerTitle = !validator.isEmpty(params.bannerTitle);
      var validate_bannerDate = !validator.isEmpty(params.bannerDate);
      var validate_paragraph = !validator.isEmpty(params.paragraph);
    } catch (error) {
      return res.status(200).send({
        message: "Missing data to send.",
      });
    }

    if (validate_bannerTitle && validate_paragraph && validate_bannerDate) {
      //Create object
      let reportSchema = new NewSchema();

      //Assign values
      reportSchema.bannerTitle = params.bannerTitle;

      reportSchema.bannerDate = params.bannerDate;
      reportSchema.paragraph = params.paragraph;
      reportSchema.paragraphTwo = params.paragraphTwo
        ? params.paragraphTwo
        : "";
      reportSchema.rightParagraph = params.rightParagraph
        ? params.rightParagraph
        : "";
      reportSchema.paragraphThree = params.paragraphThree
        ? params.paragraphThree
        : "";

      reportSchema.videoLink = params.videoLink ? params.videoLink : "";
      reportSchema.paragraphFour = params.paragraphFour
        ? params.paragraphFour
        : "";
      reportSchema.showForm = params.showForm;

      //Save topic

      reportSchema.save((err, reportStored) => {
        if (err || !reportStored) {
          return res.status(500).send({
            status: "error",
            message: "Error saving report",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          reportStored,
        });
      });
    } else {
      return res.status(200).send({
        message: "The data is not valid",
      });
    }
  },

  getNews: (req, res) => {
    //Pick actual page
    if (
      !req.params.page ||
      req.params.page == 0 ||
      req.params.page == "0" ||
      req.params.page == null ||
      req.params.page == undefined ||
      !validator.isInt(req.params.page)
    ) {
      var page = 1;
    } else {
      var page = parseInt(req.params.page);
    }

    if (
      !req.params.pageSize ||
      req.params.pageSize == 0 ||
      req.params.pageSize == "0" ||
      req.params.pageSize == null ||
      req.params.pageSize == undefined ||
      !validator.isInt(req.params.pageSize)
    ) {
      var pageSize = 1;
    } else {
      var pageSize = parseInt(req.params.pageSize);
    }

    var options = {
      sort: {
        date: -1,
      },
      limit: pageSize,
      page: page,
    };

    //Indicate options of pagination

    //Find paginated

    NewSchema.paginate({}, options, (err, reports) => {
      if (err || !reports) {
        return res.status(500).send({
          status: "error",
          message: "Failed to get the reports",
        });
      }

      // return response (Topic and all pages)
      return res.status(200).send({
        status: "success",
        reports: reports.docs,
        totalDocs: reports.totalDocs,
        totalPages: reports.totalPages,
      });
    });
  },

  getNew: (req, res) => {
    //Pick id topic from URL
    let reportId = req.params.reportId;
    //Find id by topic
    NewSchema.findById(reportId).exec((err, report) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error getting report.",
        });
      }

      if (!report) {
        return res.status(500).send({
          status: "error",
          message: "There is no report.",
        });
      }

      //Return response
      return res.status(200).send({
        status: 200,
        report,
      });
    });
  },

  update: (req, res) => {
    //Pick ip of topic
    let reportId = req.params.reportId;
    //Pick data from method POST
    var params = req.body;
    //Validate data

    try {
      var validate_bannerTitle = !validator.isEmpty(params.bannerTitle);
      var validate_bannerDate = !validator.isEmpty(params.bannerDate);
      var validate_paragraph = !validator.isEmpty(params.paragraph);
    } catch (error) {
      return res.status(200).send({
        message: "Missing data to send.",
      });
    }

    if (validate_bannerTitle && validate_paragraph && validate_bannerDate) {
      //Set a json with the data
      let update = {
        bannerTitle: params.bannerTitle,
        bannerDate: params.bannerDate,
        paragraph: params.paragraph,
        paragraphTwo: params.paragraphTwo ? params.paragraphTwo : "",
        rightParagraph: params.rightParagraph ? params.rightParagraph : "",
        paragraphThree: params.paragraphThree ? params.paragraphThree : "",
        videoLink: params.videoLink ? params.videoLink : "",
        paragraphFour: params.paragraphFour ? params.paragraphFour : "",
        showForm: params.showForm ? params.showForm : "",
      };

      //Find and update of topic by id and user's id

      NewSchema.findOneAndUpdate(
        {
          _id: reportId,
        },
        update,
        {
          new: true,
        },
        (err, reportUpdated) => {
          if (err != null) {
            return res.status(500).send({
              status: "error",
              message: "Request error.",
            });
          }

          if (!reportUpdated) {
            return res.status(404).send({
              status: "error",
              message: "Error updating report.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            new: reportUpdated,
          });
        }
      );
    } else {
      return res.status(200).send({
        message: "Data validation is not correct.",
      });
    }
  },

  delete: (req, res) => {
    //Pick el id of url
    let reportId = req.params.reportId;

    //FindByDelete by topic id and user id
    NewSchema.findOneAndDelete(
      {
        _id: reportId,
      },
      (err, reportRemoved) => {
        if (err != null) {
          return res.status(500).send({
            status: "error",
            message: "Request error.",
          });
        }

        if (!reportRemoved) {
          return res.status(404).send({
            status: "error",
            message: "Error deleting report.",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          report: reportRemoved,
        });
      }
    );
  },

  uploadBannerImage: (req, res) => {
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

      let reportId = req.params.reportId;

      //FindOneAndupdate document

      NewSchema.findOneAndUpdate(
        {
          _id: reportId,
        },
        {
          bannerImage: file_name,
        },
        {
          new: true,
        },
        (err, reportUpdated) => {
          if (err || !reportUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error saving image.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            message: "Image uploaded",
            Report: reportUpdated,
          });
        }
      );
    }
  },

  uploadFeaturedImage: (req, res) => {
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

      let reportId = req.params.reportId;

      //FindOneAndupdate document

      NewSchema.findOneAndUpdate(
        {
          _id: reportId,
        },
        {
          featuredImage: file_name,
        },
        {
          new: true,
        },
        (err, reportUpdated) => {
          if (err || !reportUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error saving image.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            message: "Image uploaded",
            Report: reportUpdated,
          });
        }
      );
    }
  },

  uploadLeftImage: (req, res) => {
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

      let reportId = req.params.reportId;

      //FindOneAndupdate document

      NewSchema.findOneAndUpdate(
        {
          _id: reportId,
        },
        {
          leftImage: file_name,
        },
        {
          new: true,
        },
        (err, reportUpdated) => {
          if (err || !reportUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error saving image.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            message: "Image uploaded",
            Report: reportUpdated,
          });
        }
      );
    }
  },
  uploadVideoImage: (req, res) => {
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
          message: "INVALID_EXTENSION",
        });
      });
    } else {
      // Get id from user identified

      let reportId = req.params.reportId;

      //FindOneAndupdate document

      NewSchema.findOneAndUpdate(
        {
          _id: reportId,
        },
        {
          videoImage: file_name,
        },
        {
          new: true,
        },
        (err, reportUpdated) => {
          if (err || !reportUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error saving image.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            message: "Image uploaded",
            Report: reportUpdated,
          });
        }
      );
    }
  },
};

module.exports = controller;
