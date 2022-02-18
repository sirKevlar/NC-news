const {
  insertCommentByArticleId,
  checkArticleExists,
} = require('../models/comments-models');

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  //   const addComment = insertCommentByArticleId(article_id, username, body);
  //   const checkArticle = checkArticleExists(article_id);

  //   Promise.all([addComment, checkArticle])
  insertCommentByArticleId(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
