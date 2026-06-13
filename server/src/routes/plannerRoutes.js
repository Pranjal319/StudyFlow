import { Router } from "express";
import { generatePlan, getPlan, updateTaskStatus } from "../controllers/plannerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getPlan);
router.post("/generate", generatePlan);
router.patch("/tasks/:id", updateTaskStatus);

export default router;
