const articlesRouter = require("express").Router();
const {
  getArticleById,
  updateArticleById,
  postCommentsToArticle,
  getCommentsByArticleId,
  getAllArticles
} = require("../controllers/articles");

const { handleErrorsNotAllowed } = require("../routes/errorHandler");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(handleErrorsNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById)
  .all(handleErrorsNotAllowed);

articlesRouter
  .route("/:articles/comments")
  .post(postCommentsToArticle)
  .get(getCommentsByArticleId)
  .all(handleErrorsNotAllowed);

module.exports = articlesRouter;
