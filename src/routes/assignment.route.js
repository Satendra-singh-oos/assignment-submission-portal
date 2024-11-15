import { Router } from "express";

import { verifyJWT, verifyPermission } from "../middlewares/auth.middleware.js";
import {
  acceptAssignment,
  getMyAssignments,
  rejectAssignment,
} from "../controllers/assignment.controller.js";

const router = Router();

// secured routes

router.route("/").get(verifyJWT, verifyPermission, getMyAssignments);
router.route("/:id/accept").post(verifyJWT, verifyPermission, acceptAssignment);
router
  .route("/:id/rejected")
  .post(verifyJWT, verifyPermission, rejectAssignment);

export default router;
