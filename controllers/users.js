const { fetchUserByUsername } = require("../models/users");

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(userArr => {
      if (userArr.length === 0) {
        next({ status: "404", msg: "Invalid username" });
      } else {
        const user = userArr[0];

        res.status(200).send({ user });
      }
    })
    .catch(next);
};
