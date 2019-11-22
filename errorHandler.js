exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};



exports.handlePsqlErrors = (err, req, res, next) => {
  
  
  const psqlBadRequestCodes = ["42703", "22P02", "23502"];
  if (err.code === "23503") {
    res.status(404).send({ msg: "404 Not found" });
  } else if (psqlBadRequestCodes.includes(err.code))
    res.status(400).send({ msg: "Bad request" });
  else next(err);
};

exports.handleErrorsNotAllowed = (req, res, next) => {
  res.status(405).send({ msg: "Error 405, method not allowed" });
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
