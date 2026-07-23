import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { NoteController } from "./note.controller";
import { NoteValidation } from "./note.validation";

const router: Router = Router();

router.post(
  "/",
  auth(),
  validateRequest(NoteValidation.createNoteValidationSchema),
  NoteController.CreateNoteController,
);
router.get("/", auth(), NoteController.GetAllNoteController);
router.get("/:id", auth(), NoteController.GetSingleNoteController);
router.patch(
  "/:id",
  auth(),
  validateRequest(NoteValidation.updateNoteValidationSchema),
  NoteController.UpdateNoteController,
);
router.delete("/:id", auth(), NoteController.DeleteNoteController);

export default router;
