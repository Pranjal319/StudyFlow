import { Router } from "express";
import { getDailyNotifications } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/daily", getDailyNotifications);

export default router;
