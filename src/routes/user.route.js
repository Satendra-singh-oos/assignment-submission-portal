import { Router } from "express";
import {
  getAllAdmin,
  loginUser,
  registerUser,
  uploadAssignment,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

// secured routes

router.route("/upload").post(verifyJWT, uploadAssignment);
router.route("/admins").get(verifyJWT, getAllAdmin);

export default router;
