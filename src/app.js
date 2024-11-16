import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

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

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// routes
import UserRoutes from "./routes/user.route.js";
import AssignmentRoutes from "./routes/assignment.route.js";

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/assignment", AssignmentRoutes);

export { app };
