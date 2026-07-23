import { Router } from "express";
import auth from "../../middlewares/auth";
import { AdminController } from "./admin.controller";

const router: Router = Router();

router.get("/dashboard", auth("ADMIN"), AdminController.getDashboardStats);
router.get("/users", auth("ADMIN"), AdminController.getAllUsers);
router.patch("/users/:id/role", auth("ADMIN"), AdminController.updateUserRole);
router.delete("/users/:id", auth("ADMIN"), AdminController.deleteUser);

export default router;