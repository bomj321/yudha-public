"user strict";
let LatestProjectSchema = require("../models/latestProject");

let controller = {
  save: (req, res) => {
    //Recolect params by post

    let params = req.body;
    //Validate data

    //Create object
    let latestProjectSchema = new LatestProjectSchema();
    //Assign values

    latestProjectSchema.title = params.title ? params.title : "";
    latestProjectSchema.subTitle = params.subTitle ? params.subTitle : "";
    //Save topic

    latestProjectSchema.save((err, latestProjectStored) => {
      if (err || !latestProjectStored) {
        return res.status(500).send({
          status: "error",
          message: "Error saving the record",
        });
      }

      //Return response
      return res.status(200).send({
        status: "success",
        latestProjectStored,
      });
    });
  },

  getLatestProject: (req, res) => {
    //Find id by topic
    LatestProjectSchema.findOne().exec((err, latestProject) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error getting latest project section.",
        });
      }

      if (!latestProject) {
        return res.status(200).send({
          status: "NOT_FOUND",
          latestProject: null,
        });
      }

      //Return response
      return res.status(200).send({
        status: 200,
        latestProject,
      });
    });
  },

  update: (req, res) => {
    //Pick ip of topic
    let latestProjectId = req.params.latestProjectId;

    //Pick data from method POST
    var params = req.body;
    //Validate data

    //Set a json with the data
    let update = {
      title: params.title ? params.title : "",
      subTitle: params.subTitle ? params.subTitle : "",
    };

    //Find and update of topic by id and user's id

    LatestProjectSchema.findOneAndUpdate(
      {
        _id: latestProjectId,
      },
      update,
      {
        new: true,
      },
      (err, latestProjectUpdated) => {
        if (err != null) {
          return res.status(500).send({
            status: "error",
            message: "Request error.",
          });
        }

        if (!latestProjectUpdated) {
          return res.status(404).send({
            status: "error",
            message: "Failed to update the latest project section.",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          topic: latestProjectUpdated,
        });
      }
    );
  },
};

module.exports = controller;
