import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

import { UserRolesEnum } from "../constant.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // get access token from the cokkie
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Unauthorized request"));
    }

    // verify the token
    const verifyedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    const userId = verifyedToken?._id;

    // check dose user exist with this userId or not
    const user = await User.findById(userId).select("-password ");

    if (!user) {
      return res
        .status(405)
        .json(new ApiResponse(405, {}, "User Not Found Invalid Token"));
    }

    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, error?.message || "Verify JWT Failed"));
  }
});

export const verifyPermission = asyncHandler(async (req, res, next) => {
  try {
    // get the user id from the req.user
    if (!req.user?._id) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Unauthorized request"));
    }

    // check the role of user is admin or not
    if (UserRolesEnum.ADMIN === req.user?.role) {
      next();
    } else {
      return res
        .status(403)
        .json(
          new ApiResponse(403, {}, "You are not allowed to perform this action")
        );
    }
  } catch (error) {
    return res
      .status(403)
      .json(
        new ApiResponse(
          403,
          {},
          error?.message || "You are not allowed to perform this action"
        )
      );
  }
});
