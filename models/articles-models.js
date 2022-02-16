const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `
        SELECT * FROM articles 
        WHERE article_id = $1;
    `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length < 1) {
        return Promise.reject({
          status: 404,
          msg: 'ID not found',
        });
      } else return rows;
    });
};

exports.updateArticleById = (article_id, votes) => {
  if (!votes) {
    return Promise.reject({
      status: 400,
      msg: 'Bad patch body',
    });
  }

  return db
    .query(
      `
  UPDATE articles 
  SET votes = votes + $1 
  WHERE article_id = $2 
  RETURNING*;
  `,
      [votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length < 1) {
        return Promise.reject({
          status: 404,
          msg: 'ID not found',
        });
      } else return rows[0];
    });
};
