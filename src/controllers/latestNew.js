"user strict";
let LatestNewSchema = require("../models/latestNew");

let controller = {
  save: (req, res) => {
    //Recolect params by post

    let params = req.body;
    //Validate data

    //Create object
    let latestNewSchema = new LatestNewSchema();
    //Assign values

    latestNewSchema.title = params.title ? params.title : "";
    latestNewSchema.subTitle = params.subTitle ? params.subTitle : "";
    //Save topic

    latestNewSchema.save((err, latestNewStored) => {
      if (err || !latestNewStored) {
        return res.status(500).send({
          status: "error",
          message: "Error saving the record",
        });
      }

      //Return response
      return res.status(200).send({
        status: "success",
        latestNewStored,
      });
    });
  },

  getLatestNew: (req, res) => {
    //Find id by topic
    LatestNewSchema.findOne().exec((err, latestNew) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error getting latest new section.",
        });
      }

      if (!latestNew) {
        return res.status(200).send({
          status: "NOT_FOUND",
          latestNew: null,
        });
      }

      //Return response
      return res.status(200).send({
        status: 200,
        latestNew,
      });
    });
  },

  update: (req, res) => {
    //Pick ip of topic
    let latestNewId = req.params.latestNewId;

    //Pick data from method POST
    var params = req.body;
    //Validate data

    //Set a json with the data
    let update = {
      title: params.title ? params.title : "",
      subTitle: params.subTitle ? params.subTitle : "",
    };

    //Find and update of topic by id and user's id

    LatestNewSchema.findOneAndUpdate(
      {
        _id: latestNewId,
      },
      update,
      {
        new: true,
      },
      (err, latestNewUpdated) => {
        if (err != null) {
          return res.status(500).send({
            status: "error",
            message: "Request error.",
          });
        }

        if (!latestNewUpdated) {
          return res.status(404).send({
            status: "error",
            message: "Failed to update the latest new section.",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          topic: latestNewUpdated,
        });
      }
    );
  },
};

module.exports = controller;
