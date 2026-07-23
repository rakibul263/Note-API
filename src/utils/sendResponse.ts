import { Response } from "express";
import { PaginationMeta } from "../interface/query";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
};

const sendResponse = <T>(res: Response, payload: TResponse<T>) => {
  res.status(payload.statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data,
    ...(payload.meta && { meta: payload.meta }),
  });
};

export default sendResponse;
