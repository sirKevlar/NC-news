const db = require('../db/connection');

exports.insertCommentByArticleId = (article_id, author, body) => {
  return db
    .query(
      `
    INSERT INTO comments 
    (article_id, author, body) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `,
      [article_id, author, body]
    )
    .then(({ rows }) => {
      return rows;
    });
};
