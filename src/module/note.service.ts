import prisma from "../config/prisma";
import { CreateNotePayload } from "./note.interface";

const CreateNoteIntoDB = async (payload: CreateNotePayload) => {
  const result = await prisma.note.create({
    data: payload,
  });
  return result;
};

// get all notes
const GetAllNotesIntoDB = async () => {
  const result = await prisma.note.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

export const NoteService = {
  CreateNoteIntoDB,
  GetAllNotesIntoDB,
};
