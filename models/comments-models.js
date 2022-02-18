const db = require('../db/connection');

// exports.checkArticleExists = (article_id) => {
//   return db
//     .query(
//       `
//     SELECT * FROM articles 
//     WHERE article_id = $1`,
//       [article_id]
//     )
//     .then(({ rows }) => {
//       if (rows.length < 1) {
//         console.log(rows);
//         return Promise.reject({
//           status: 404,
//           msg: 'Id not found',
//         });
//       }
//     });
// };

exports.insertCommentByArticleId = (article_id, author, body) => {
  if (!article_id || !author || !body) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  } else {
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
  }
};
