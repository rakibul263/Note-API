import jwt, { Secret, SignOptions } from "jsonwebtoken";

const createToken = (payload: object, secret: string, expiresIn: string) => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret);
};

export const jwtToken = {
    verifyToken,
    createToken
};
