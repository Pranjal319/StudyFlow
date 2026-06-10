import { asyncHandler } from "../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      studyHoursPerDay: req.user.studyHoursPerDay,
      darkMode: req.user.darkMode,
      streak: req.user.streak,
      achievements: req.user.achievements
    }
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, studyHoursPerDay, darkMode } = req.body;

  if (typeof name === "string") {
    req.user.name = name;
  }

  if (typeof studyHoursPerDay === "number") {
    req.user.studyHoursPerDay = studyHoursPerDay;
  }

  if (typeof darkMode === "boolean") {
    req.user.darkMode = darkMode;
  }

  await req.user.save();
  res.json({ user: req.user });
});
