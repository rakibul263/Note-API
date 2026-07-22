import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { NoteController } from "./note.controller";
import { NoteValidation } from "./note.validation";

const router = Router();

router.post(
  "/",
  validateRequest(NoteValidation.createNoteValidationSchema),
  NoteController.CreateNoteController,
);
router.get("/", NoteController.GetAllNoteController);
router.get("/:id", NoteController.GetSingleNoteController);
router.patch(
  "/:id",
  validateRequest(NoteValidation.updateNoteValidationSchema),
  NoteController.UpdateNoteController,
);
router.delete("/:id", NoteController.DeleteNoteController);

export default router;
