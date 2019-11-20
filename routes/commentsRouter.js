const commentsRouter = require("express").Router();
const {
  incOrDecCommentVote,
  deleteCommentByCommentId
} = require("../controllers/comments");

commentsRouter
  .route("/:comments_id")
  .patch(incOrDecCommentVote)
  .delete(deleteCommentByCommentId);

module.exports = commentsRouter;
