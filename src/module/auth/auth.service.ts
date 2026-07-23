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

const createTokens = (user: { id: number; email: string }) => {
  const accessToken = jwtToken.createToken(
    { id: user.id, email: user.email },
    env.JWT_ACCESS_SECRET!,
    env.JWT_ACCESS_EXPIRES_IN!,
  );
  const refreshToken = jwtToken.createToken(
    { id: user.id, email: user.email },
    env.JWT_REFRESH_SECRET!,
    env.JWT_REFRESH_EXPIRES_IN!,
  );
  return { accessToken, refreshToken };
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

  const { accessToken, refreshToken } = createTokens(user);

  await prisma.session.create({
    data: {
      refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  const { password, ...userData } = user;

  return {
    accessToken,
    refreshToken,
    user: userData,
  };
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Refresh token is required");
  }

  const session = await prisma.session.findFirst({
    where: { refreshToken: token },
  });

  if (!session) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }

  await prisma.session.delete({
    where: { id: session.id },
  });

  const decoded = verifyToken(token, env.JWT_REFRESH_SECRET!) as JwtPayload;

  const user = await prisma.user.findUnique({
    where: { email: decoded.email },
  });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const { accessToken, refreshToken: newRefreshToken } = createTokens(user);

  await prisma.session.create({
    data: {
      refreshToken: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const AuthService = {
  register,
  login,
  refreshToken,
};
