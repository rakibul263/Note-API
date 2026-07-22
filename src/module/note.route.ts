import { Router } from "express";
import { NoteController } from "./note.controller";

const router = Router();

router.post("/", NoteController.CreateNoteController);
router.get("/", NoteController.GetAllNoteController);

export default router;
