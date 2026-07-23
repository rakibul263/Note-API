import prisma from "../../config/prisma";
import QueryBuilder from "../../utils/queryBuilder";
import { CreateNotePayload, UpdateNotePayload } from "./note.interface";

const CreateNoteIntoDB = async (payload: CreateNotePayload) => {
  const result = await prisma.note.create({
    data: payload,
  });
  return result;
};

// get all notes
const GetAllNotesIntoDB = async (query: Record<string, unknown>) => {
  const result = await new QueryBuilder(query)
    .search(["title", "content"])
    .filter(["userId", "title", "content"])
    .sort("createdAt", "desc")
    .paginate()
    .execute(prisma.note, {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    });

  return result;
};

// get single note
const getSingleNoteFromDB = async (id: number, userId: number) => {
  const result = await prisma.note.findUnique({
    where: {
      id,
      userId,
    },
  });
  return result;
};

const updateNoteIntoDB = async (
  id: number,
  payload: UpdateNotePayload,
  userId: number,
) => {
  const result = await prisma.note.update({
    where: {
      id,
      userId,
    },
    data: payload,
  });
  return result;
};

const DeleteNoteFromDB = async (id: number, userId: number) => {
  const result = await prisma.note.delete({
    where: {
      id,
      userId,
    },
  });
  return result;
};

export const NoteService = {
  CreateNoteIntoDB,
  GetAllNotesIntoDB,
  getSingleNoteFromDB,
  updateNoteIntoDB,
  DeleteNoteFromDB,
};
