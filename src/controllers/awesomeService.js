"user strict";
let AwesomeServiceSchema = require("../models/awesomeService");

let controller = {
  save: (req, res) => {
    //Recolect params by post
    let params = req.body;
    //Create object
    let awesomeServiceSchema = new AwesomeServiceSchema();
    //Assign values

    awesomeServiceSchema.title = params.title ? params.title : "";
    awesomeServiceSchema.subTitle = params.subTitle ? params.subTitle : "";
    //Save topic

    awesomeServiceSchema.save((err, awesomeServiceStored) => {
      if (err || !awesomeServiceStored) {
        return res.status(200).send({
          status: "error",
          message: "Error saving the information",
        });
      }

      //Return response
      return res.status(200).send({
        status: "success",
        awesomeServiceStored,
      });
    });
  },

  getAwesomeService: (req, res) => {
    //Find id by topic
    AwesomeServiceSchema.findOne().exec((err, awesomeService) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error getting the information.",
        });
      }

      if (!awesomeService) {
        return res.status(200).send({
          status: "error",
          awesomeService: null,
        });
      }

      //Return response
      return res.status(200).send({
        status: 200,
        awesomeService,
      });
    });
  },

  update: (req, res) => {
    //Pick ip of topic
    let awesomeServiceId = req.params.awesomeServiceId;
    //Pick data from method POST
    var params = req.body;
    //Validate data

    //Set a json with the data

    let update = {
      title: params.title ? params.title : "",
      subTitle: params.subTitle ? params.subTitle : "",
    };

    //Find and update of topic by id and user's id

    AwesomeServiceSchema.findOneAndUpdate(
      {
        _id: awesomeServiceId,
      },
      update,
      {
        new: true,
      },
      (err, awesomeServiceUpdated) => {
        if (err != null) {
          return res.status(500).send({
            status: "error",
            message: "Request error.",
          });
        }

        if (!awesomeServiceUpdated) {
          return res.status(404).send({
            status: "error",
            message: "Failed to update the information.",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          aboutMe: awesomeServiceUpdated,
        });
      }
    );
  },
};

module.exports = controller;
