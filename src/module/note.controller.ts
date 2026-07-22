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

const GetSingleNoteController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await NoteService.getSingleNoteFromDB(id);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Data fetch successfully.",
    data: result,
  });
};

const UpdateNoteController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const note = await NoteService.getSingleNoteFromDB(id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
    });
  }

  const result = await NoteService.updateNoteIntoDB(id, req.body);

  res.status(200).json({
    success: true,
    message: "Note updated successfully.",
    data: result,
  });
};

const DeleteNoteController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const note = await NoteService.getSingleNoteFromDB(id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
    });
  }

  await NoteService.DeleteNoteFromDB(id);

  res.status(200).json({
    success: true,
    message: "Note deleted successfully",
  });
};
export const NoteController = {
  CreateNoteController,
  GetAllNoteController,
  GetSingleNoteController,
  UpdateNoteController,
  DeleteNoteController,
};
