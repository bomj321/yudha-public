"user strict";
let validator = require("validator");
let Tab = require("../models/tab");

let controller = {
  save: (req, res) => {
    //Recolect params by post
    let params = req.body;
    //Validate data

    try {
      var validate_nameTab = !validator.isEmpty(params.nameTab);
      var validate_description = !validator.isEmpty(params.description);
      var validate_showTab = !validator.isEmpty(params.showTab);
    } catch (error) {
      return res.status(200).send({
        message: "Missing data to send.",
      });
    }

    if (validate_nameTab && validate_description && validate_showTab) {
      //Create object
      let tab = new Tab();

      //Assign values
      tab.nameTab = params.nameTab;
      tab.description = params.description;
      tab.showTab = params.showTab;
      //Save topic

      tab.save((err, tabStored) => {
        if (err || !tabStored) {
          return res.status(500).send({
            status: "error",
            message: "Error saving tab",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          tabStored,
        });
      });
    } else {
      return res.status(200).send({
        message: "The data is not valid",
      });
    }
  },

  getTabs: (req, res) => {
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

    Tab.paginate({}, options, (err, tabs) => {
      if (err || !tabs) {
        return res.status(500).send({
          status: "error",
          message: "Failed to get the tabs",
        });
      }

      // return response (Topic and all pages)
      return res.status(200).send({
        status: "success",
        tabs: tabs.docs,
        totalDocs: tabs.totalDocs,
        totalPages: tabs.totalPages,
      });
    });
  },

  getTab: (req, res) => {
    //Pick id topic from URL
    let tabId = req.params.tabId;
    //Find id by topic
    Tab.findById(tabId).exec((err, tab) => {
      if (err) {
        tab;
        return res.status(500).send({
          status: "error",
          message: "Error getting tab.",
        });
      }

      if (!tab) {
        return res.status(200).send({
          status: "error",
          tab: null,
        });
      }

      //Return response
      return res.status(200).send({
        status: 200,
        tab,
      });
    });
  },

  update: (req, res) => {
    //Pick ip of topic
    let tabId = req.params.tabId;
    //Pick data from method POST
    var params = req.body;
    //Validate data

    try {
      var validate_nameTab = !validator.isEmpty(params.nameTab);
      var validate_description = !validator.isEmpty(params.description);
      var validate_showTab = !validator.isEmpty(params.showTab);
    } catch (error) {
      return res.status(200).send({
        message: "Missing data to send.",
      });
    }

    if (validate_nameTab && validate_description && validate_showTab) {
      //Set a json with the data
      let update = {
        nameTab: params.nameTab,
        description: params.description,
        showTab: params.showTab,
      };

      //Find and update of topic by id and user's id

      Tab.findOneAndUpdate(
        {
          _id: tabId,
        },
        update,
        {
          new: true,
        },
        (err, tabUpdated) => {
          if (err != null) {
            return res.status(500).send({
              status: "error",
              message: "Request error.",
            });
          }

          if (!tabUpdated) {
            return res.status(404).send({
              status: "error",
              message: "Error updating tab.",
            });
          }

          //Return response
          return res.status(200).send({
            status: "success",
            tab: tabUpdated,
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
    let tabId = req.params.tabId;

    //FindByDelete by topic id and user id
    Tab.findOneAndDelete(
      {
        _id: tabId,
      },
      (err, tabRemoved) => {
        if (err != null) {
          return res.status(500).send({
            status: "error",
            message: "Request error.",
          });
        }

        if (!tabRemoved) {
          return res.status(404).send({
            status: "error",
            message: "Error deleting topic.",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          tab: tabRemoved,
        });
      }
    );
  },
};

module.exports = controller;
