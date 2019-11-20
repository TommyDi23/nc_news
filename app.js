const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

// 42703 - not a valid column
// 23503 - Key (author)=(notValidUsername) is not present in table "users
// 22P02 - invalid input syntax for type integer
//

app.use((err, req, res, next) => {
  //console.log(err);
  const psqlBadRequestCodes = ["42703", "23503", "22P02",'23502'];
  if (psqlBadRequestCodes.includes(err.code))
    res.status(400).send({ msg: "Bad request" });
  else next(err);
});

app.use((err, req, res, next) => {
  res.status(405).send({ msg: "Error 405, method not allowed" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
