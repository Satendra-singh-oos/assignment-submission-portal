import dotenv from "dotenv";
import connectDb from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(
        `🎉 Server is up and running at port : ${process.env.PORT || 8000}`
      );
    });

    app.on("error", (error) => {
      console.log("⚠️ Server connection Error: ", error);
      throw error;
    });
  })
  .catch((err) => {
    console.log("⚠️ MongoDb Faild To Connectoion", err);
  });
