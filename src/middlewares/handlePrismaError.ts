import { StatusCodes } from "http-status-codes";
import { Prisma } from "../generated/prisma/client";
import { TGenericErrorResponse } from "../interface/error";

const handlePrismaError = (
  error: Prisma.PrismaClientKnownRequestError,
): TGenericErrorResponse => {
  if (error.code === "P2002") {
    return {
      statusCode: StatusCodes.CONFLICT,
      message: "Duplicate value found",
      errorSources: [
        {
          path: "database",
          message: "This value already exists",
        },
      ],
    };
  }
  if (error.code === "P2025") {
    return {
      statusCode: StatusCodes.NOT_FOUND,
      message: "Record not found",
      errorSources: [
        {
          path: "database",
          message: "Requested record does not exist",
        },
      ],
    };
  }
  return {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "Database Error",
    errorSources: [
      {
        path: "",
        message: error.message,
      },
    ],
  };
};

export default handlePrismaError;
