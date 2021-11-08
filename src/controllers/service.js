"user strict";
let validator = require("validator");
let ServiceSchema = require("../models/service");

let controller = {
  save: (req, res) => {
    //Recolect params by post
    let params = req.body;
    //Validate data

    try {
      var validate_bannerTitle = !validator.isEmpty(params.bannerTitle);
      var validate_icon = !validator.isEmpty(params.icon);
      var validate_subTitle = !validator.isEmpty(params.subTitle);
      var validate_subTitleText = !validator.isEmpty(params.subTitleText);
      var validate_promisesText = !validator.isEmpty(params.promisesText);
      var validate_whoIAmText = !validator.isEmpty(params.whoIAmText);
      var validate_finalText = !validator.isEmpty(params.finalText);
    } catch (error) {
      return res.status(200).send({
        message: "Missing data to send.",
      });
    }

    if (
      validate_bannerTitle &&
      validate_icon &&
      validate_subTitle &&
      validate_subTitleText &&
      validate_promisesText &&
      validate_whoIAmText &&
      validate_finalText
    ) {
      //Create object
      let serviceSchema = new ServiceSchema();

      //Assign values
      serviceSchema.bannerTitle = params.bannerTitle;
      serviceSchema.icon = params.icon;
      serviceSchema.subTitle = params.subTitle;
      serviceSchema.subTitleText = params.subTitleText;
      serviceSchema.promisesText = params.promisesText;
      serviceSchema.whoIAmText = params.whoIAmText;
      serviceSchema.finalText = params.finalText;
      serviceSchema.benefitsList = params.benefitsList
        ? params.benefitsList
        : [];
      serviceSchema.firstMediaUrl = params.firstMediaUrl
        ? params.firstMediaUrl
        : null;

      serviceSchema.secondMediaUrl = params.secondMediaUrl
        ? params.secondMediaUrl
        : null;

      serviceSchema.thirdMediaUrl = params.thirdMediaUrl
        ? params.thirdMediaUrl
        : null;

      serviceSchema.titleBenefits = params.titleBenefits
        ? params.titleBenefits
        : null;

      serviceSchema.titlePromises = params.titlePromises
        ? params.titlePromises
        : null;

      serviceSchema.titleWhoIAmText = params.titleWhoIAmText
        ? params.titleWhoIAmText
        : null;

      //Save topic

      serviceSchema.save((err, serviceStored) => {
        if (err || !serviceStored) {
          return res.status(500).send({
            status: "error",
            message: "Error saving service",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          serviceStored,
        });
      });
    } else {
      return res.status(200).send({
        message: "The data is not valid",
      });
    }
  },

  getServices: (req, res) => {
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

    ServiceSchema.paginate({}, options, (err, services) => {
      if (err || !services) {
        return res.status(500).send({
          status: "error",
          message: "Failed to get the services",
        });
      }

      // return response (Topic and all pages)
      return res.status(200).send({
        status: "success",
        services: services.docs,
        totalDocs: services.totalDocs,
        totalPages: services.totalPages,
      });
    });
  },

  getService: (req, res) => {
    //Pick id topic from URL
    let serviceId = req.params.serviceId;
    //Find id by topic
    ServiceSchema.findById(serviceId).exec((err, service) => {
      if (err) {
        service;
        return res.status(500).send({
          status: "error",
          message: "Error getting service.",
        });
      }

      if (!service) {
        return res.status(200).send({
          status: "error",
          service: null,
        });
      }

      //Return response
      return res.status(200).send({
        status: 200,
        service,
      });
    });
  },

  update: (req, res) => {
    //Pick ip of topic
    let serviceId = req.params.serviceId;
    //Pick data from method POST
    var params = req.body;
    //Validate data

    try {
      var validate_bannerTitle = !validator.isEmpty(params.bannerTitle);
      var validate_icon = !validator.isEmpty(params.icon);
      var validate_subTitle = !validator.isEmpty(params.subTitle);
      var validate_subTitleText = !validator.isEmpty(params.subTitleText);
      var validate_promisesText = !validator.isEmpty(params.promisesText);
      var validate_whoIAmText = !validator.isEmpty(params.whoIAmText);
      var validate_finalText = !validator.isEmpty(params.finalText);
    } catch (error) {
      return res.status(200).send({
        message: "Missing data to send.",
      });
    }

    if (
      validate_bannerTitle &&
      validate_icon &&
      validate_subTitle &&
      validate_subTitleText &&
      validate_promisesText &&
      validate_whoIAmText &&
      validate_finalText
    ) {
      //Set a json with the data
      let update = {
        bannerTitle: params.bannerTitle,
        icon: params.icon,
        subTitle: params.subTitle,
        subTitleText: params.subTitleText,
        promisesText: params.promisesText,
        whoIAmText: params.whoIAmText,
        finalText: params.finalText,
        benefitsList: params.benefitsList ? params.benefitsList : [],
        firstMediaUrl: params.firstMediaUrl ? params.firstMediaUrl : null,
        secondMediaUrl: params.secondMediaUrl ? params.secondMediaUrl : null,
        thirdMediaUrl: params.thirdMediaUrl ? params.thirdMediaUrl : null,

        titleBenefits: params.titleBenefits ? params.titleBenefits : null,
        titlePromises: params.titlePromises ? params.titlePromises : null,
        titleWhoIAmText: params.titleWhoIAmText ? params.titleWhoIAmText : null,
      };

      //Find and update of topic by id and user's id

      ServiceSchema.findOneAndUpdate(
        {
          _id: serviceId,
        },
        update,
        {
          new: true,
        },
        (err, serviceUpdated) => {
          if (err != null) {
            return res.status(500).send({
              status: "error",
              message: "Request error.",
            });
          }

          if (!serviceUpdated) {
            return res.status(404).send({
              status: "error",
              message: "Error updating service.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            service: serviceUpdated,
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
    let serviceId = req.params.serviceId;

    //FindByDelete by topic id and user id
    ServiceSchema.findOneAndDelete(
      {
        _id: serviceId,
      },
      (err, serviceRemoved) => {
        if (err != null) {
          return res.status(500).send({
            status: "error",
            message: "Request error.",
          });
        }

        if (!serviceRemoved) {
          return res.status(404).send({
            status: "error",
            message: "Error deleting service.",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          service: serviceRemoved,
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
      //let file_split = file_path.split("\\");  //Windows
      let file_split = file_path.split("/"); //Linux
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

      let serviceId = req.params.serviceId;

      //FindOneAndupdate document

      ServiceSchema.findOneAndUpdate(
        {
          _id: serviceId,
        },
        {
          bannerImage: file_name,
        },
        {
          new: true,
        },
        (err, serviceUpdated) => {
          if (err || !serviceUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error saving image.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            message: "Image uploaded",
            Service: serviceUpdated,
          });
        }
      );
    }
  },

  uploadFirstMedia: (req, res) => {
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
      //let file_split = file_path.split("\\");  //Windows
      let file_split = file_path.split("/"); //Linux
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

      let serviceId = req.params.serviceId;

      //FindOneAndupdate document

      ServiceSchema.findOneAndUpdate(
        {
          _id: serviceId,
        },
        {
          firstMediaLink: file_name,
        },
        {
          new: true,
        },
        (err, serviceUpdated) => {
          if (err || !serviceUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error saving image.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            message: "Image uploaded",
            Service: serviceUpdated,
          });
        }
      );
    }
  },

  uploadSecondMedia: (req, res) => {
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
      //let file_split = file_path.split("\\");  //Windows
      let file_split = file_path.split("/"); //Linux
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

      let serviceId = req.params.serviceId;

      //FindOneAndupdate document

      ServiceSchema.findOneAndUpdate(
        {
          _id: serviceId,
        },
        {
          secondMediaLink: file_name,
        },
        {
          new: true,
        },
        (err, serviceUpdated) => {
          if (err || !serviceUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error saving image.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            message: "Image uploaded",
            Service: serviceUpdated,
          });
        }
      );
    }
  },

  uploadThirdMedia: (req, res) => {
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
      //let file_split = file_path.split("\\");  //Windows
      let file_split = file_path.split("/"); //Linux
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

      let serviceId = req.params.serviceId;

      //FindOneAndupdate document

      ServiceSchema.findOneAndUpdate(
        {
          _id: serviceId,
        },
        {
          thirdMediaLink: file_name,
        },
        {
          new: true,
        },
        (err, serviceUpdated) => {
          if (err || !serviceUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Error saving image.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            message: "Image uploaded",
            Service: serviceUpdated,
          });
        }
      );
    }
  },
};

module.exports = controller;
