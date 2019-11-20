const connection = require("../db/connection");

exports.selectArticleById = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments.comment_id" })
    .returning("*");
};

exports.updateSelectedArticle = (inc_votes, article_id) => {
  return connection("articles")
    .where("article_id", article_id)
    .increment({ votes: inc_votes })
    .returning("*");
};

exports.addCommentToArticle = (articles, username, body) => {
  return connection
    .insert({ article_id: articles, author: username, body: body })
    .into("comments")
    .returning("*");
};

exports.sendCommentsByArticleId = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", article_id)
    .returning("*")
    .orderBy(sort_by, order);
};
