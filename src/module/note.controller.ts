import { Request, Response } from "express";
import { NoteService } from "./note.service";

const CreateNoteController = async (req: Request, res: Response) => {
  const result = await NoteService.CreateNoteIntoDB(req.body);

  res.status(201).json({
    success: true,
    message: "Note created successfully",
    data: result,
  });
};

const GetAllNoteController = async (req: Request, res: Response) => {
  const result = await NoteService.GetAllNotesIntoDB();

  res.status(200).json({
    success: true,
    message: "Data Fetch Successfully.",
    data: result,
  });
};

export const NoteController = {
  CreateNoteController,
  GetAllNoteController,
};
