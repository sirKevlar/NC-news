exports.invalidPath = (req, res) => {
  res.status(404).send({ msg: 'Path not found' });
};

exports.psqlErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request' });
  } else next(err);
};

exports.customErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
};

exports.serverError = (err, req, res) => {
  res.status(500).send({ msg: 'Kev server error' });
};
