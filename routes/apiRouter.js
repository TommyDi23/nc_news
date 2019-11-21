const apiRouter = require("express").Router();
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const endPoints = require("../endpoints.json");
const { handleErrorsNotAllowed } = require("../routes/errorHandler");

apiRouter
  .route("/")
  .get((req, res) => {
    res.send(endPoints);
  })
  .all(handleErrorsNotAllowed);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
