import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import AppError from "../../errors/AppError";
import QueryBuilder from "../../utils/queryBuilder";

const getDashboardStats = async () => {
  const [totalUsers, totalNotes, adminCount, userCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.note.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { role: "USER" } }),
    ]);

  return { totalUsers, totalNotes, adminCount, userCount };
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const result = await new QueryBuilder(query)
    .search(["name", "email"])
    .filter(["role"])
    .sort("createdAt", "desc")
    .paginate()
    .execute(prisma.user, {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    });

  return result;
};

const updateUserRole = async (id: number, role: string) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (role !== "ADMIN" && role !== "USER") {
    throw new AppError(StatusCodes.BAD_REQUEST, "Role must be ADMIN or USER");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role: role as any },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const deleteUser = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  await prisma.user.delete({ where: { id } });
};

export const AdminService = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
};