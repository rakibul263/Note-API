import cors from "cors";
import type { Application } from "express";
import express from "express";
import swaggerUi from "swagger-ui-express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import AuthRouter from "./module/auth/auth.route";
import NoteRouter from "./module/notes/note.route";
import AdminRouter from "./module/admin/admin.route";
import cookieParser from "cookie-parser";
import swaggerDoc from "./config/swagger";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Node API App is running...");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use("/api/notes", NoteRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/admin", AdminRouter);

app.use(globalErrorHandler);

export default app;
