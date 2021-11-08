"user strict";

let validator = require("validator");
let bcrypt = require("bcrypt-nodejs");
let User = require("../models/user");
let jwt = require("../services/jwt");

let controller = {
  save: (req, res) => {
    // Recolect the parameters in the request

    let params = req.body;

    // Validate data   validator

    let validate_name = !validator.isEmpty(params.name);
    let validate_surname = params.surname
      ? !validator.isEmpty(params.surname)
      : true;
    let validate_email =
      !validator.isEmpty(params.email) && validator.isEmail(params.email);
    let validate_password = params.password
      ? !validator.isEmpty(params.password)
      : true;

    if (
      validate_name &&
      validate_surname &&
      validate_email &&
      validate_password
    ) {
      // Create user's object
      let user = new User();
      // Assign values in the object user

      user.name = params.name;
      user.surname = params.surname ? params.surname : "Sin apellido";
      user.email = params.email.toLowerCase();
      user.role = params.role ? params.role : "ROLE_USER";
      (user.message = params.message ? params.message : "NOT_MESSAGE"),
        (user.subject = params.subject ? params.subject : "NOT_SUBJECT"),
        (user.image = null);

      // Verify if the user exists

      User.findOne(
        {
          email: user.email,
        },
        (err, issetUser) => {
          if (err) {
            return res.status(500).send({
              message: "Error al comprobar duplicidad de usuario",
            });
          }

          if (!issetUser || params.role == "ROLE_USER") {
            // And if not, hash the password

            if (params.password && params.role != "ROLE_USER") {
              bcrypt.hash(params.password, null, null, (err, hash) => {
                user.password = hash;
                //Save user

                user.save((err, userStored) => {
                  if (err) {
                    return res.status(500).send({
                      message: "ERROR_SAVING_USER",
                    });
                  } else if (!userStored) {
                    // Return response
                    return res.status(500).send({
                      message: "ERROR_SAVING_USER",
                      user,
                    });
                  } else {
                    return res.status(200).send({
                      message: "USER_SAVED",
                      user,
                    });
                  }
                }); //Close save
              }); // Close bcrypt
            } else {
              user.save((err, userStored) => {
                if (err) {
                  return res.status(500).send({
                    message: "ERROR_SAVING_USER",
                  });
                } else if (!userStored) {
                  // Return response
                  return res.status(500).send({
                    message: "ERROR_SAVING_USER",
                    user,
                  });
                } else {
                  return res.status(200).send({
                    message: "USER_SAVED",
                    user,
                  });
                }
              }); //Close save
            }
          } else {
            return res.status(200).send({
              message: "USER_REGISTERED",
            });
          }
        }
      );
    } else {
      return res.status(200).send({
        message: "INVALID_DATA",
      });
    }
  },

  login: (req, res) => {
    //Recolect params

    let params = req.body;

    // Validate data

    try {
      var validate_email =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);
      var validate_password = !validator.isEmpty(params.password);
    } catch (error) {
      return res.status(200).send({
        message: "MISSING_DATA",
      });
    }

    if (validate_email && validate_password) {
      //Find user

      //If the user exists...
      User.findOne(
        {
          email: params.email.toLowerCase(),
          role: "ROLE_ADMIN",
        },
        (err, user) => {
          if (err) {
            return res.status(500).send({
              message: "ERROR_IN_LOGIN",
            });
          }

          if (!user) {
            return res.status(404).send({
              message: "USER_DONT_EXIST",
            });
          }
          //Verify the password (EMAIL AND PASSWORD)

          bcrypt.compare(params.password, user.password, (err, check) => {
            //If It's correct

            if (check) {
              //Geneate JWT's token

              if (params.gettoken) {
                return res.status(200).send({
                  token: jwt.createToken(user),
                });
              } else {
                //Clean the object user

                user.password = undefined;
                //Return response

                return res.status(200).send({
                  status: "success",
                  user,
                  token: jwt.createToken(user),
                });
              }
            } else {
              return res.status(200).send({
                message: "BAD_CREDENTIALS",
              });
            }
          });
        }
      );
    } else {
      return res.status(404).send({
        message: "BAD_CREDENTIALS",
      });
    }
  },

  update: (req, res) => {
    //Recolect user's data
    var params = req.body;

    try {
      !validator.isEmpty(params.name);
      !validator.isEmpty(params.surname);
      !validator.isEmpty(params.email) && validator.isEmail(params.email);
    } catch (error) {
      return res.status(200).send({
        message: "Faltan datos por enviar",
      });
    }

    // Delete unnecesary properties
    delete params.password;
    //Find and Update
    var userId = req.user.sub;

    //Prove if the email is unique

    User.findOneAndUpdate(
      {
        _id: userId,
      },
      params,
      {
        new: true,
      },
      (err, userUpdated) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Error al actualizar usuario",
          });
        }

        if (!userUpdated) {
          return res.status(500).send({
            status: "error",
            message: "No se ha actualizado el usuario",
          });
        }

        //Return response
        return res.status(200).send({
          status: "success",
          user: userUpdated,
        });
      }
    );
  },

  getUsers: (req, res) => {
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

    User.paginate(
      {
        role: "ROLE_USER",
      },
      options,
      (err, users) => {
        if (err || !users) {
          return res.status(500).send({
            status: "error",
            message: "Failed to get the users",
          });
        }

        // return response (Topic and all pages)
        return res.status(200).send({
          status: "success",
          users: users.docs,
          totalDocs: users.totalDocs,
          totalPages: users.totalPages,
        });
      }
    );
  },

  getUser: (req, res) => {
    let userId = req.params.userId;
    User.findById(userId).exec((err, user) => {
      if (err || !user) {
        return res.status(500).send({
          status: "error",
          message: "No existe el usuario",
        });
      }

      //Return response
      return res.status(200).send({
        status: "success",
        user,
      });
    });
  },
};

module.exports = controller;
