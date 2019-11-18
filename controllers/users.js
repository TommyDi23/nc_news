const { fetchUserByUsername } = require("../models/users");

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;

  fetchUserByUsername(username).then(userArr => {
    const user = userArr[0];

    res.status(200).send({ user });
  });
};
