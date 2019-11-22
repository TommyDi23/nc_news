const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleErrorsNotAllowed,
  handleServerErrors
} = require("./errorHandler");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) =>
  next({ status: 404, msg: "Route not found" })
);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleErrorsNotAllowed);
app.use(handleServerErrors);



module.exports = app;
