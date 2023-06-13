function errorHandlers(err, req, res, next) {
  console.log("==== error handlers output ====");
  console.log("UNDETECTED ERRORS:\n", err);
  console.log("ERROR WITH NAME:\n", err.name);

  if (err.name === "SequelizeValidationError") {
    res.status(400).json({
      err: {
        status: "400 Bad Request!",
        errorMessage: err.errors[0].message,
        code: 400,
      },
    });
  }

  if (err.name === "JsonWebTokenError") {
    res.status(400).json({
      err: {
        status: "400 Bad Request!",
        errorMessage: err.message,
        code: 400,
        success: false,
      },
    });
  }

  if (err && err.code) {
    res.status(err.code).json({ err });
  }
  console.log("==== error handlers output ====");
}

module.exports = errorHandlers;
