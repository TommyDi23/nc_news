const {
  selectArticleById,
  updateSelectedArticle,
  addCommentToArticle,
  sendCommentsByArticleId,
  sendArticals
} = require("../models/articles");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(articleArr => {
      if (articleArr.length === 0) {
        res.status(404).send({ msg: "404 Not found" });
      } else {
        const article = articleArr[0];
        res.status(200).send({ article });
      }
    })
    .catch(next);
};

exports.updateArticleById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  const patchLength = Object.keys(req.body).length;

  if (patchLength > 1) {
    next({ status: "400", msg: "Bad request" });
  }

  updateSelectedArticle(inc_votes, article_id)
    .then(article => {
      const updatedArticle = article[0];
      res.status(200).send(updatedArticle);
    })
    .catch(next);
};

exports.postCommentsToArticle = (req, res, next) => {
  const { username, body } = req.body;
  const { articles } = req.params;

  addCommentToArticle(articles, username, body)
    .then(comment => {
      const postedComment = comment[0];
      res.status(201).send(postedComment);
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params.articles;
  const { sort_by, order } = req.query;
  sendCommentsByArticleId(article_id, sort_by, order)
    .then(commentArr => {
      if (commentArr.length === 0) {
        res.status(404).send({ msg: "404 Not found" });
      } else {
        res.status(200).send(commentArr);
      }
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by } = req.query;
  sendArticals(sort_by)
    .then(articles => {
      res.status(200).send(articles);
    })
    .catch(next);
};
