const connection = require("../db/connection");

exports.updateCommentVote = (comments_id, inc_votes=0) => {
  return connection("comments")
    .where("comment_id", comments_id)
    .increment({ votes: inc_votes })
    .returning("*");
};

exports.destroyComment = comments_id => {
  return connection("comments")
    .where("comment_id", comments_id)
    .del();
};
