import mongoose, { Schema } from "mongoose";
import {
  ASSIGNMENTStatusEnum,
  AvailableAssignmentStatus,
} from "../constant.js";

const assignmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: {
      type: String,
      required: [true, "task is required"],
    },
    status: {
      type: String,
      enum: AvailableAssignmentStatus,
      default: ASSIGNMENTStatusEnum.PENDING,
    },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model("Assignment", assignmentSchema);
