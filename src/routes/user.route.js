import { Router } from "express";
import passport from "passport";
import {
  getAllAdmin,
  handleSocialLogin,
  loginUser,
  registerUser,
  uploadAssignment,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import "../utils/passport.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

// unsecured route
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// sso
router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    res.send("redirecting to google...");
  }
);

router
  .route("/google/callback")
  .get(passport.authenticate("google"), handleSocialLogin);

// secured routes

router.route("/upload").post(verifyJWT, uploadAssignment);
router.route("/admins").get(verifyJWT, getAllAdmin);

router.route("/profile").get(verifyJWT, (_, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "Login With Google OAuth Successfully"));
});

export default router;
