import mongoose from "mongoose";

const studyTaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    plannedDate: {
      type: Date,
      required: true,
      index: true
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 25
    },
    priorityScore: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ["pending", "completed", "skipped"],
      default: "pending"
    },
    source: {
      type: String,
      enum: ["ai-plan", "manual"],
      default: "ai-plan"
    },
    pomodorosPlanned: {
      type: Number,
      default: 1
    },
    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("StudyTask", studyTaskSchema);
