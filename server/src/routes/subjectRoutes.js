import { Router } from "express";
import { createSubject, deleteSubject, getSubjects, updateSubject } from "../controllers/subjectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getSubjects);
router.post("/", createSubject);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

export default router;
