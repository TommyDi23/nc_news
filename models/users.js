const connection = require("../db/connection");

exports.fetchUserByUsername = username => {
  return connection("users").where("username", username);
};
