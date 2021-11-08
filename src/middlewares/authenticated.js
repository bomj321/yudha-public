"user strict";

let jwt = require("jwt-simple");
let moment = require("moment");
let secret = "key-secret";

exports.authenticated = (req, res, next) => {
  // Verify if the bearer token is present

  if (!req.headers.authorization) {
    return res.status(401).send({
      message: "Sorry you are not authorized",
    });
  }

  //Clean token and delete ""

  let token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    //Decode token
    let payload = jwt.decode(token, secret);

    //Prove if the token is valid
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        message: "The token has expired",
      });
    }

    //To attach user identified to request
    req.user = payload;
  } catch (error) {
    return res.status(401).send({
      message: "The token is not valid",
    });
  }

  //Next action
  next();
};
