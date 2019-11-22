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

exports.updateSelectedArticle = (inc_votes = 0, article_id) => {
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
    .orderBy(sort_by, order)
    .then(comments => {
      if (comments.length < 1) {
        return Promise.all([[], checkIfExist(article_id)]);
      } else {
        return [comments];
      }
    });
};

exports.sendArticals = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments.comment_id" })
    .returning("*")
    .orderBy(sort_by, order)
    .modify(query => {
      if (author) {
        query.where("articles.author", author);
      }
      if (topic) {
        query.where("articles.topic", topic);
      }
    })
    .then(articles => {
      if (articles.length < 1) {
        return Promise.all([
          [],
          checkIfTopicExist(topic),
          checkIfAuthorExist(author)
        ]);
      } else {
        return [articles]
      }
    });
};

function checkIfExist(article_id) {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .then(articles => {
      if (articles.length < 1) {
        return Promise.reject({
          status: "404",
          msg: "Not found artical doesn't exist"
        });
      }
    });
}

function checkIfTopicExist(topic) {
  if (!topic) {
    return true;
  }
  return connection
    .select("*")
    .from("topics")
    .where("slug", topic)
    .then(topic => {
      if (topic.length < 1) {
        return Promise.reject({
          status: "404",
          msg: "Not found topic doesn't exist"
        });
      }
    });
}

function checkIfAuthorExist(author) {
  if (!author) {
    return true;
  }
  return connection
    .select("*")
    .from("users")
    .where("username", author)
    .then(user => {
      if (user.length < 1) {
        return Promise.reject({
          status: "404",
          msg: "Not found author doesn't exist"
        });
      }
    });
}
