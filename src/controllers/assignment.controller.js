import { isValidObjectId } from "mongoose";
import { Assignment } from "../models/assignment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ASSIGNMENTStatusEnum } from "../constant.js";

// assuming the route is protected
const getMyAssignments = asyncHandler(async (req, res) => {
  const adminId = req.user?.id;

  const assignments = await Assignment.find({ adminId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        assignments,
        "Fetched All Assignments For This User Succesfully"
      )
    );
});

const acceptAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(401, "Not A Valid Id");
  }

  // check dose assignment exist or not

  const assignemnt = await Assignment.findById(id);

  // if assignment dose not exist throw error
  if (!assignemnt) {
    throw new ApiError(404, "Assignment dose not exist");
  }

  // now check if the currnet user got assgined to this assignment

  if (assignemnt.adminId.toString() !== req.user?.id.toString()) {
    throw new ApiError(
      404,
      "You Are Not Authorized Do Accept / Reject This Assignment"
    );
  }

  //update the assginment status
  const updatedAssignment = await Assignment.findByIdAndUpdate(
    id,
    { status: ASSIGNMENTStatusEnum.ACCEPTED },
    { new: true }
  ).select("-userId -adminId");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedAssignment, "Assignment updated successfull")
    );
});

const rejectAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(401, "Not A Valid Id");
  }

  // check dose assignment exist or not

  const assignemnt = await Assignment.findById(id);

  // if assignment dose not exist throw error
  if (!assignemnt) {
    throw new ApiError(404, "Assignment dose not exist");
  }

  // now check if the currnet user got assgined to this assignment

  if (assignemnt.adminId.toString() !== req.user?.id.toString()) {
    throw new ApiError(
      404,
      "You Are Not Authorized Do Accept / Reject This Assignment"
    );
  }

  //update the assginment status
  const updatedAssignment = await Assignment.findByIdAndUpdate(
    id,
    { status: ASSIGNMENTStatusEnum.REJECTED },
    { new: true }
  ).select("-userId -adminId");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedAssignment, "Assignment updated successfull")
    );
});

export { getMyAssignments, acceptAssignment, rejectAssignment };
