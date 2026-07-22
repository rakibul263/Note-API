import Prisma from "../config/prisma";
import { CreateNotePayload } from "./note.interface";

const CreateNoteIntoDB = async (payload: CreateNotePayload) => {
  const result = await Prisma.note.create({
    data: payload,
  });
  return result;
};

export const NoteService = {
  CreateNoteIntoDB,
};
