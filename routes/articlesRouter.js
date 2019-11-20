const articlesRouter = require("express").Router();
const {
  getArticleById,
  updateArticleById,
  postCommentsToArticle,
  getCommentsByArticleId
} = require("../controllers/articles");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById);

articlesRouter
  .route("/:articles/comments")
  .post(postCommentsToArticle)
  .get(getCommentsByArticleId);

module.exports = articlesRouter;
