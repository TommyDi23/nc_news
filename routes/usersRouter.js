const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users");
const { handleErrorsNotAllowed } = require("../routes/errorHandler");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(handleErrorsNotAllowed);

module.exports = usersRouter;
