import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NoteService } from "./note.service";

const CreateNoteController = catchAsync(async (req, res) => {
  const result = await NoteService.CreateNoteIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Note created successfully",
    data: result,
  });
});

const GetAllNoteController = catchAsync(async (req, res) => {
  const result = await NoteService.GetAllNotesIntoDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Data Fetch Successfully.",
    data: result,
  });
});

const GetSingleNoteController = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const result = await NoteService.getSingleNoteFromDB(id);

  if (!result) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: true,
      message: "Note Not Found",
    });
    return;
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
  const note = await NoteService.getSingleNoteFromDB(id);

  if (!note) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: true,
      message: "Note Not Found",
    });
    return;
  }

  const result = await NoteService.updateNoteIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Note Updated Successfully.",
    data: result,
  });
});

const DeleteNoteController = catchAsync(async (req, res) => {
  const id = Number(req.params.id);
  const note = await NoteService.getSingleNoteFromDB(id);

  if (!note) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: true,
      message: "Note Not Found",
    });
    return;
  }

  await NoteService.DeleteNoteFromDB(id);

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
