import cors from "cors";
import type { Application } from "express";
import express from "express";
import NoteRouter from "./module/note.route";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Node API App is running...");
});

app.use("/api/note", NoteRouter);

export default app;
