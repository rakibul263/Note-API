import { Router } from "express";
import { NoteController } from "./note.controller";

const router = Router();

router.post("/", NoteController.CreateNoteController);

export default router;
