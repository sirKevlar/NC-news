exports.invalidPath = (req, res) => {
  res.status(404).send({ msg: 'Path not found' });
};

exports.serverError = (err, req, res) => {
  res.status(500).send({ msg: 'Kev server error' });
};
