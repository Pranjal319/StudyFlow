import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
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
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudyTask"
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    minutesStudied: {
      type: Number,
      default: 0
    },
    pomodoroSessions: {
      type: Number,
      default: 0
    },
    completedTasks: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

progressSchema.index({ user: 1, subject: 1, date: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);
