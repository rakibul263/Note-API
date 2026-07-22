import { Router } from "express";
import { NoteController } from "./note.controller";

const router = Router();

router.post("/", NoteController.CreateNoteController);
router.get("/", NoteController.GetAllNoteController);
router.get("/:id", NoteController.GetSingleNoteController);
router.patch("/:id", NoteController.UpdateNoteController);

export default router;
