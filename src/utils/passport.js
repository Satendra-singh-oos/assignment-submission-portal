import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import { ApiError } from "./ApiError.js";
import { UserLoginType, UserRolesEnum } from "../constant.js";

try {
  passport.serializeUser((user, next) => {
    next(null, user._id);
  });

  passport.deserializeUser(async (id, next) => {
    try {
      const user = await User.findById(id);
      if (user) next(null, user);
      else next(new ApiError(404, "User does not exist"), null);
    } catch (error) {
      next(
        new ApiError(
          500,
          "Something went wrong while deserializing the user. Error: " + error
        ),
        null
      );
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (_, __, profile, next) => {
        // check if the user with email already exist

        const user = await User.findOne({ email: profile._json.email });
        // if user exist
        if (user) {
          // check if user has registerd with GOOGLE SSO

          if (user.loginType !== UserLoginType.GOOGLE) {
            // if user is registered with some other methord,we will ask him/her to use same method as login
            next(
              new ApiError(
                400,
                "You have previously registered using " +
                  user.loginType?.toLowerCase()?.split("_").join(" ") +
                  ". Please use the " +
                  user.loginType?.toLowerCase()?.split("_").join(" ") +
                  " login option to access your account."
              ),
              null
            );
          } else {
            // if user is registerd with the same login method we will send the saved user

            next(null, user);
          }
        } else {
          // if user is with email dose not exist means the user is coming for the first time

          const username = profile._json.email?.split("@")[0];

          const createdUser = await User.create({
            email: profile._json.email,
            password: profile._json.sub,
            username:
              username.charAt(0).toUpperCase() +
              username.slice(1).toLowerCase(),
            role: UserRolesEnum.USER,
            loginType: UserLoginType.GOOGLE,
          });

          if (createdUser) {
            next(null, createdUser);
          } else {
            next(new ApiError(500, "Error while registering the user"), null);
          }
        }
      }
    )
  );
} catch (error) {
  console.error("🛂 PASSPORT ERROR: ", error);
}
