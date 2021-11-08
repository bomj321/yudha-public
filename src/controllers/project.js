"user strict";
let validator = require("validator");
let ProjectSchema = require("../models/project");
let fs = require("fs");

let controller = {
  save: (req, res) => {
    //Recolect params by post
    let params = req.body;
    //Validate data

    try {
      var validate_bannerTitle = !validator.isEmpty(params.bannerTitle);
      var validate_paragraph = !validator.isEmpty(params.paragraph);
      var validate_videoLink = !validator.isEmpty(params.videoLink);
    } catch (error) {
      return res.status(200).send({
        message: "Missing data to send.",
      });
    }

    if (validate_bannerTitle && validate_paragraph && validate_videoLink) {
      //Create object
      let projectSchema = new ProjectSchema();

      //Assign values
      projectSchema.bannerTitle = params.bannerTitle;
      projectSchema.paragraph = params.paragraph;
      projectSchema.videoLink = params.videoLink;
      //Save topic

      projectSchema.save((err, projectStored) => {
        if (err || !projectStored) {
          return res.status(500).send({
            status: "error",
            message: "Error saving project",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          projectStored,
        });
      });
    } else {
      return res.status(200).send({
        message: "The data is not valid",
      });
    }
  },

  getProjects: (req, res) => {
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

    ProjectSchema.paginate({}, options, (err, projects) => {
      if (err || !projects) {
        return res.status(500).send({
          status: "error",
          message: "Failed to get the projects",
        });
      }

      // return response (Topic and all pages)
      return res.status(200).send({
        status: "success",
        projects: projects.docs,
        totalDocs: projects.totalDocs,
        totalPages: projects.totalPages,
      });
    });
  },

  getProject: (req, res) => {
    //Pick id topic from URL
    let projectId = req.params.projectId;
    //Find id by topic
    ProjectSchema.findById(projectId).exec((err, project) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error getting project.",
        });
      }

      if (!project) {
        return res.status(500).send({
          status: "error",
          message: "There is no project.",
        });
      }

      //Return response
      return res.status(200).send({
        status: 200,
        project,
      });
    });
  },

  update: (req, res) => {
    //Pick ip of topic
    let projectId = req.params.projectId;
    //Pick data from method POST
    var params = req.body;
    //Validate data

    try {
      var validate_bannerTitle = !validator.isEmpty(params.bannerTitle);
      var validate_paragraph = !validator.isEmpty(params.paragraph);
      var validate_videoLink = !validator.isEmpty(params.videoLink);
    } catch (error) {
      return res.status(200).send({
        message: "Missing data to send.",
      });
    }

    if (validate_bannerTitle && validate_paragraph && validate_videoLink) {
      //Set a json with the data
      let update = {
        bannerTitle: params.bannerTitle,
        paragraph: params.paragraph,
        videoLink: params.videoLink,
      };

      //Find and update of topic by id and user's id

      ProjectSchema.findOneAndUpdate(
        {
          _id: projectId,
        },
        update,
        {
          new: true,
        },
        (err, projectUpdated) => {
          if (err != null) {
            return res.status(500).send({
              status: "error",
              message: "Request error.",
            });
          }

          if (!projectUpdated) {
            return res.status(404).send({
              status: "error",
              message: "Error updating project.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            project: projectUpdated,
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
    let projectId = req.params.projectId;

    //FindByDelete by topic id and user id
    ProjectSchema.findOneAndDelete(
      {
        _id: projectId,
      },
      (err, projectRemoved) => {
        if (err != null) {
          return res.status(500).send({
            status: "error",
            message: "Request error.",
          });
        }

        if (!projectRemoved) {
          return res.status(404).send({
            status: "error",
            message: "Error deleting project.",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          project: projectRemoved,
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

      let projectId = req.params.projectId;

      //FindOneAndupdate document

      ProjectSchema.findOneAndUpdate(
        {
          _id: projectId,
        },
        {
          bannerImage: file_name,
        },
        {
          new: true,
        },
        (err, projectUpdated) => {
          if (err || !projectUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error saving image.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            message: "Image uploaded",
            Project: projectUpdated,
          });
        }
      );
    }
  },

  uploadAdditionalImage: (req, res) => {
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

      let projectId = req.params.projectId;

      //FindOneAndupdate document

      ProjectSchema.findOneAndUpdate(
        {
          _id: projectId,
        },
        {
          additionalImage: file_name,
        },
        {
          new: true,
        },
        (err, projectUpdated) => {
          if (err || !projectUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error saving image.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            message: "Image uploaded",
            Project: projectUpdated,
          });
        }
      );
    }
  },
};

module.exports = controller;
