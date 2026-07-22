import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};

export default globalErrorHandler;
