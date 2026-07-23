import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getDashboardStats = catchAsync(async (req, res) => {
  const stats = await AdminService.getDashboardStats();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dashboard stats fetched successfully",
    data: stats,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await AdminService.getAllUsers();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const { role } = req.body;
  const user = await AdminService.updateUserRole(id, role);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User role updated successfully",
    data: user,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  await AdminService.deleteUser(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User deleted successfully",
  });
});

export const AdminController = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
};