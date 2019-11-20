const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics");
const { handleErrorsNotAllowed } = require("../routes/errorHandler");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(handleErrorsNotAllowed);

module.exports = topicsRouter;
