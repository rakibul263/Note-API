import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NoteService } from "./note.service";

const CreateNoteController = catchAsync(async (req, res) => {
  const result = await NoteService.CreateNoteIntoDB({
    ...req.body,
    userId: Number(req.user.id),
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Note created successfully",
    data: result,
  });
});

const GetAllNoteController = catchAsync(async (req, res) => {
  const result = await NoteService.GetAllNotesIntoDB({
    ...req.query,
    userId: Number(req.user.id),
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Data Fetch Successfully.",
    data: result.data,
    meta: result.meta,
  });
});

const GetSingleNoteController = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const result = await NoteService.getSingleNoteFromDB(id, Number(req.user.id));

  if (!result) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Note Not Found.");
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Data Fetch Successfully.",
    data: result,
  });
});

const UpdateNoteController = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const note = await NoteService.getSingleNoteFromDB(id, Number(req.user.id));

  if (!note) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Note Not Found.");
  }

  const result = await NoteService.updateNoteIntoDB(
    id,
    req.body,
    Number(req.user.id),
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Note Updated Successfully.",
    data: result,
  });
});

const DeleteNoteController = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const note = await NoteService.getSingleNoteFromDB(id, Number(req.user.id));

  if (!note) {
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Note Not Found.");
  }

  await NoteService.DeleteNoteFromDB(id, Number(req.user.id));

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Note Delete Successfully.",
  });
});

export const NoteController = {
  CreateNoteController,
  GetAllNoteController,
  GetSingleNoteController,
  UpdateNoteController,
  DeleteNoteController,
};
