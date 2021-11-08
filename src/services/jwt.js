"user strict";

let jwt = require("jwt-simple");
let moment = require("moment");

exports.createToken = (user) => {
  let payload = {
    sub: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(1, "days").unix,
  };

  return jwt.encode(payload, "clave-secreta-para-generar-el-token-9999");
};
