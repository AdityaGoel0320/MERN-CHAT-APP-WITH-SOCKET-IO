import { envMode } from "../app.js";

const errorMiddleware = (err, req, res, next) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  if (err.code === 11000) {
    const duplicateFields = err.keyPattern || err.keyValue || {};
    const isUsernameDuplicate = Object.hasOwn(duplicateFields, "username");
    const error = Object.keys(duplicateFields).join(",");
    err.message = isUsernameDuplicate
      ? "Username is already taken. Please choose another one."
      : `Duplicate field - ${error}`;
    err.statusCode = isUsernameDuplicate ? 409 : 400;
  }

  if (err.name === "CastError") {
    const errorPath = err.path;
    err.message = `Invalid Format of ${errorPath}`;
    err.statusCode = 400;
  }

  const response = {
    success: false,
    message: err.message,
  };

  if (envMode === "DEVELOPMENT") {
    response.error = err;
  }

  return res.status(err.statusCode).json(response);
};

const TryCatch = (passedFunc) => async (req, res, next) => {
  try {
    await passedFunc(req, res, next);
  } catch (error) {
    next(error);
  }
};

export { errorMiddleware, TryCatch };
