import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.use(cookieParser());

// routes
import UserRoutes from "./routes/user.route.js";
import AssignmentRoutes from "./routes/assignment.route.js";

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/assignment", AssignmentRoutes);

export { app };
