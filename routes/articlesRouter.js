const articlesRouter = require("express").Router();
const {
  getArticleById,
  updateArticleById,
  postCommentsToArticle,
  getCommentsByArticleId,
  getAllArticles
} = require("../controllers/articles");

articlesRouter.route("/").get(getAllArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById);

articlesRouter
  .route("/:articles/comments")
  .post(postCommentsToArticle)
  .get(getCommentsByArticleId);

module.exports = articlesRouter;
