import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import env from "../../config/env";
import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";
import { RegisterPayload } from "./auth.interface";

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

export const AuthService = {
  register,
};
