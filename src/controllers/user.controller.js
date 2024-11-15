import { UserRolesEnum } from "../constant.js";
import { Assignment } from "../models/assignment.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  assignmentSchemaValidation,
  loginSchemaValidation,
  userSchemaValidation,
} from "../utils/JoiValidation.js";

const genrateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    // genrate the user accessToken
    const accessToken = await user.genrateAccessToken();

    await user.save({ validateBeforeSave: false });
    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating the access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //validate the req.body with joi validation
  const { error, value } = userSchemaValidation.validate(req.body);

  // throw error if something wrong in validating of data
  if (error) {
    throw new ApiError(406, error.message);
  }

  const { username, email, password } = value;

  // check dose user already exist with this username or email
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  // if exist throw error

  if (existingUser) {
    // return res
    //   .status(409)
    //   .json(
    //     new ApiError(
    //  409,
    //     "UserName Or Email Allredy exist in db try to login"
    //     )
    //   );

    throw new ApiError(
      409,
      "UserName Or Email Allredy exist in db try to login"
    );
  }

  // create a new user

  const newUser = await User.create({
    username:
      username.charAt(0).toUpperCase() + username.slice(1).toLowerCase(), // make sure the saved username will have first letter as cappital and other as small
    email,
    password,
  });

  const newUserId = newUser._id;

  const createdUser = await User.findById(newUserId).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Created Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //validate the req.body with joi validation

  const { error, value } = loginSchemaValidation.validate(req.body);

  // throw error if something wrong in validating of data

  if (error) {
    throw new ApiError(406, error.message);
  }

  const { email, password } = value;

  // check dose user already exist with this  email

  const user = await User.findOne({ email });

  // if user dose not exist throw error
  if (!user) {
    throw new ApiError(
      400,
      "User Email Dose Not Exist , Please Register First"
    );
  }

  // check if the given passowrd is correct or not
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  // if password is not correct throw error
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is Incorrect");
  }

  //genrate the access token for user
  const { accessToken } = await genrateAccessToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };
  // return user , accessToken and set token in user cookies

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User logged In Successfully"
      )
    );
});

const uploadAssignment = asyncHandler(async (req, res) => {
  //validate the req.body with joi validation
  const { error, value } = assignmentSchemaValidation.validate(req.body);

  // throw error if something wrong in validating of data

  if (error) {
    throw new ApiError(401, error.message);
  }

  const { userId, task, admin } = value;

  // check dose the given userId exist in database or not
  const user = await User.findOne({ username: userId });

  // if user dose not throw error
  if (!user) {
    throw new ApiError(401, "User Dose Not Exist With This UserId");
  }

  // check dose the admin user exist or not

  const adminUser = await User.findOne({
    $and: [{ username: admin }, { role: UserRolesEnum.ADMIN }],
  });

  // if admin user dose not exist throw error
  if (!adminUser) {
    throw new ApiError(401, "Admin Dose Not Exist Check Again");
  }

  // create the assignemnt

  const assignment = await Assignment.create({
    userId: user._id,
    task,
    adminId: adminUser._id,
  });

  const uploadedAssignment = await Assignment.findById(assignment._id).select(
    "-userId -adminId"
  );

  if (!uploadedAssignment) {
    throw new ApiError(500, "Something went wrong while uploading Assignment");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        uploadedAssignment,
        `Assignment Uploaded Succesfully,Current Status is ${assignment.status} Wait For Admin Response`
      )
    );
});

const getAllAdmin = asyncHandler(async (req, res) => {
  // find all the user with the role admin and only select the name of the admin
  const admins = await User.find({ role: UserRolesEnum.ADMIN }).select(
    "-password -email"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, admins, "Fetched All Admin Succesfully"));
});

export { registerUser, loginUser, uploadAssignment, getAllAdmin };
