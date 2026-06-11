import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    examDate: {
      type: Date
    },
    weeklyTargetHours: {
      type: Number,
      default: 4,
      min: 1,
      max: 40
    },
    difficulty: {
      type: Number,
      default: 3,
      min: 1,
      max: 5
    },
    currentConfidence: {
      type: Number,
      default: 3,
      min: 1,
      max: 5
    },
    color: {
      type: String,
      default: "#14b8a6"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Subject", subjectSchema);
