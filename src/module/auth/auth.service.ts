import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import env from "../../config/env";
import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";
import { jwtToken, verifyToken } from "../../utils/jwt";
import { LoginPayload, RegisterPayload } from "./auth.interface";

const register = async (payload: RegisterPayload) => {
  const hashPassword = await bcrypt.hash(
    payload.password,
    env.BCRYPT_SALT_ROUNDS,
  );

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashPassword,
    },
  });

  const { password, ...userData } = user;
  return userData;
};

const login = async (payload: LoginPayload) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found.");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const accessToken = jwtToken.createToken(
    { id: user.id, email: user.email },
    env.JWT_ACCESS_SECRET!,
    env.JWT_ACCESS_EXPIRES_IN!,
  );
  const refreshToken = jwtToken.createToken(
    {
      id: user.id,
      email: user.email,
    },
    env.JWT_REFRESH_SECRET!,
    env.JWT_REFRESH_EXPIRES_IN!,
  );
  const { password, ...userData } = user;

  return {
    accessToken,
    refreshToken,
    user: userData,
  };
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Refresh toke is required");
  }

  const decoded = verifyToken(token, env.JWT_REFRESH_SECRET!) as JwtPayload;

  const user = await prisma.user.findUnique({
    where: {
      email: decoded.email,
    },
  });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "user not found");
  }

  const accessToken = jwtToken.createToken(
    {
      id: user.id,
      email: user.email,
    },
    env.JWT_ACCESS_SECRET!,
    env.JWT_ACCESS_EXPIRES_IN!,
  );
  return {
    accessToken,
  }
};
export const AuthService = {
  register,
  login,
  refreshToken,
};
