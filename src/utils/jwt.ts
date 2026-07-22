import jwt from "jsonwebtoken";

const createToken = (payload: object, secret: string, expiresIn: string) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export default createToken;
