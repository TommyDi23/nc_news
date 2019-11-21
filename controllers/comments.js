const { updateCommentVote, destroyComment } = require("../models/comments");

exports.incOrDecCommentVote = (req, res, next) => {
  const { comments_id } = req.params;
  const { inc_votes } = req.body;

  const patchLength = Object.keys(req.body).length;

  if (patchLength > 1) {
    next({ status: "400", msg: "Bad request" });
  }

  updateCommentVote(comments_id, inc_votes)
    .then(comment => {
      if (comment.length === 0) {
        next({ status: "404", msg: "404 Not found" });
      } else {
        const updatedComment = comment[0];
        res.status(200).send({ comment: updatedComment });
      }
    })
    .catch(next);
};

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comments_id } = req.params;

  destroyComment(comments_id)
    .then(row => {
      if (row === 0) {
        next({ status: "404", msg: "Not Found" });
      } else if (row === 1) {
        res.sendStatus(204);
      }
    })
    .catch(next);
};
