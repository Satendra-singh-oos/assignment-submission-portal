import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const verifyedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    const userId = verifyedToken?._id;

    const user = await User.findById(userId).select("-password ");

    if (!user) {
      throw new ApiError(405, "Invaled Access Token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
};

export const verifyPermission = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized request");
    }

    if (UserRolesEnum.includes(req.user?.role)) {
      next();
    } else {
      throw new ApiError(403, "You are not allowed to perform this action");
    }
  } catch (error) {
    throw new ApiError(
      403,
      error?.message || "You are not allowed to perform this action"
    );
  }
};
