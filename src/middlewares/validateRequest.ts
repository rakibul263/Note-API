import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod/v3";

const validateRequest = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
