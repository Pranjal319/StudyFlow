import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function serializeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    studyHoursPerDay: user.studyHoursPerDay,
    darkMode: user.darkMode,
    streak: user.streak,
    achievements: user.achievements
  };
}

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, studyHoursPerDay } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    res.status(409);
    throw new Error("An account with that email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    studyHoursPerDay
  });

  res.status(201).json({
    token: generateToken(user._id),
    user: serializeUser(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");

  if (!user || !(await user.comparePassword(password || ""))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    token: generateToken(user._id),
    user: serializeUser(user)
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.json({ message: "Logout successful. Remove the JWT on the client." });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: serializeUser(req.user) });
});
