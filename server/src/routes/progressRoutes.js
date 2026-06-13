import { Router } from "express";
import { getTodayProgress, logStudySession } from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/today", getTodayProgress);
router.post("/session", logStudySession);

export default router;
