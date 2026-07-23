import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import env from "../config/env";
import AppError from "../errors/AppError";
import { verifyToken } from "../utils/jwt";
interface TUser {
  id: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user: TUser;
    }
  }
}

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
    }

    let jwtToken: string | undefined = token;
    if (token.startsWith("Bearer ")) {
      jwtToken = token.split(" ")[1];
    }

    if (!jwtToken) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
    }
    const verifiedToken = verifyToken(
      jwtToken,
      env.JWT_ACCESS_SECRET!,
    ) as TUser;

    req.user = verifiedToken;

    if (roles.length && !roles.includes(verifiedToken.role)) {
      throw new AppError(StatusCodes.FORBIDDEN, "Forbidden Access");
    }

    next();
  };
};

export default auth;
