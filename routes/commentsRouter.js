const commentsRouter = require("express").Router();
const {
  incOrDecCommentVote,
  deleteCommentByCommentId
} = require("../controllers/comments");
const { handleErrorsNotAllowed } = require("../routes/errorHandler");

commentsRouter
  .route("/:comments_id")
  .patch(incOrDecCommentVote)
  .delete(deleteCommentByCommentId)
  .all(handleErrorsNotAllowed);

module.exports = commentsRouter;
