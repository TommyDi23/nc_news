const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      const usersInsertions = knex("users")
        .insert(userData)
        .returning("*");
      const topicsInsertions = knex("topics")
        .insert(topicData)
        .returning("*");

      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      const formattedArticleData = formatDates(articleData);

      return knex
        .insert(formattedArticleData)
        .into("articles")
        .returning("*");

     
    })
    .then(articleRows => {
      
     
      const articleRef = makeRefObj(articleRows);
      const formattedComments = formatComments(commentData, articleRef);
      return knex("comments")
        .insert(formattedComments)
        
    });
};
