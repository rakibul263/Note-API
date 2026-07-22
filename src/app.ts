import cors from "cors";
import type { Application } from "express";
import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import NoteRouter from "./module/notes/note.route";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Node API App is running...");
});

app.use("/api/notes", NoteRouter);

app.use(globalErrorHandler);

export default app;
