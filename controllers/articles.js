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
        next({ status: 404, msg: "404 Not found" });
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

      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};

exports.postCommentsToArticle = (req, res, next) => {
  const { username, body } = req.body;
  const { articles } = req.params;

  addCommentToArticle(articles, username, body)
    .then(comment => {
      const postedComment = comment[0];

      res.status(201).send({ comment: postedComment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params.articles;
  const { sort_by, order, limit, p } = req.query;
  sendCommentsByArticleId(article_id, sort_by, order, limit, p)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic, limit, p } = req.query;

  sendArticals(sort_by, order, author, topic, limit, p)
    .then(([articles]) => {
      res.status(200).send({ articles, total_count: articles.length });
    })
    .catch(next);
};
