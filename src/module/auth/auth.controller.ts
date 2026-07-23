import { StatusCodes } from "http-status-codes";
import env from "../../config/env";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const register = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User registered successfully.",
    data: result,
  });
});

const loginController = catchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Login Successful.",
    data: result,
  });
});

const refreshToken = catchAsync(async(req, res) => {
    const token = req.cookies.refreshToken;
    const result = await AuthService.refreshToken(token)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Access token generated successfully.",
        data: result
    })
})

const logout = catchAsync(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logged out successfully.",
  });
});

export const AuthController = {
  register,
  loginController,
  refreshToken,
  logout,
};
