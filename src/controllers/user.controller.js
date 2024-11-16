import { UserLoginType, UserRolesEnum } from "../constant.js";
import { Assignment } from "../models/assignment.model.js";
import { User } from "../models/user.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  assignmentSchemaValidation,
  loginSchemaValidation,
  userSchemaValidation,
} from "../utils/JoiValidation.js";

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    // genrate the user accessToken
    const accessToken = await user.genrateAccessToken();

    await user.save({ validateBeforeSave: false });
    return { accessToken };
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "Something went wrong while generating the access token"
        )
      );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  try {
    //validate the req.body with joi validation
    const { error, value } = userSchemaValidation.validate(req.body);

    // throw error if something wrong in validating of data
    if (error) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, error?.message || "Not Valid Data"));
    }

    const { username, email, password } = value;

    // check dose user already exist with this username or email
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    // if exist or null throw error
    if (existingUser) {
      return res
        .status(409)
        .json(
          new ApiResponse(
            409,
            {},
            "UserName Or Email Allredy exist in db try to login"
          )
        );
    }

    // create a new user

    const newUser = await User.create({
      username:
        username.charAt(0).toUpperCase() + username.slice(1).toLowerCase(),
      email,
      password,
      role: UserRolesEnum.USER,
      loginType: UserLoginType.EMAIL_PASSWORD,
    });

    const newUserId = newUser._id;

    const createdUser = await User.findById(newUserId).select("-password");

    if (!createdUser) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            {},
            "Something went wrong while registering the user"
          )
        );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, createdUser, "User Created Successfully"));
  } catch (error) {
    return res
      .status(error.code === 11000 ? 409 : 500)
      .json(
        new ApiResponse(
          error.code === 11000 ? 409 : 500,
          {},
          error.code === 11000
            ? "UserName Or Email Allredy exist in db try to login"
            : "Something went wrong while registering the user"
        )
      );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  //validate the req.body with joi validation

  const { error, value } = loginSchemaValidation.validate(req.body);

  // throw error if something wrong in validating of data

  if (error) {
    return res
      .status(406)
      .json(new ApiResponse(500, {}, error?.message || "Not Valid Data"));
  }

  const { email, password } = value;

  // check dose user already exist with this  email

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          "User Email Dose Not Exist , Please Register First"
        )
      );
  }

  if (user.loginType !== UserLoginType.EMAIL_PASSWORD) {
    // If user is registered with some other method, we will ask him/her to use the same method as registered.

    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          "You have previously registered using " +
            user.loginType?.toLowerCase() +
            ". Please use the " +
            user.loginType?.toLowerCase() +
            " login option to access your account."
        )
      );
  }

  // check if the given passowrd is correct or not
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Password is Incorrect"));
  }

  const { accessToken } = await generateAccessToken(user._id);

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

const handleSocialLogin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "User does not exist"));
  }

  const { accessToken } = await generateAccessToken(user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res.status(301).cookie("accessToken", accessToken, options).redirect(
    // redirect user to the frontend with access and refresh token in case user is not using cookies
    `${process.env.CLIENT_SSO_REDIRECT_URL}?accessToken=${accessToken}`
  );
});

const uploadAssignment = asyncHandler(async (req, res) => {
  // check for userId
  if (!req.user?._id) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Unauthorized request"));
  }
  //validate the req.body with joi validation
  const { error, value } = assignmentSchemaValidation.validate(req.body);

  if (error) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, error?.message || "Not A Valid Data"));
  }

  const { task, admin } = value;

  // ? Removed Due To Extra Db Call before we getting userId from the body and haveing an extra check from db
  // // check dose the given userId exist in database or not
  // const user = await User.findOne({ username: userId });

  // // if user dose not throw error
  // if (!user) {
  // return res
  //  .status(401)
  //  .json(new ApiResponse(401, {}, "User Dose Not Exist With This UserId"));
  // }

  // check dose the admin user exist or not

  const adminUser = await User.findOne({
    $and: [{ username: admin }, { role: UserRolesEnum.ADMIN }],
  });

  if (!adminUser) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Admin Dose Not Exist Check Again"));
  }

  // create the assignemnt

  const assignment = await Assignment.create({
    userId: req.user?._id,
    task,
    adminId: adminUser._id,
  });

  const uploadedAssignment = await Assignment.findById(assignment._id).select(
    "-userId -adminId"
  );

  if (!uploadedAssignment) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "Something went wrong while uploading Assignment"
        )
      );
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

export {
  registerUser,
  loginUser,
  uploadAssignment,
  getAllAdmin,
  handleSocialLogin,
};
