import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    task: {
      type: String,
      required: [true, "task is required"],
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Accepted", "Pending", "Rejected"],
    },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model("Assignment", assignmentSchema);
