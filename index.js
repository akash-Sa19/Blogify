// node function import
const path = require("node:path");

// other imports
const userRouter = require("./routes/user");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/authentication");

// express import and stuff
const express = require("express");
const app = express();
const PORT = 8000;

// database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then(() => console.log("MongoDB Connected"))
  .catch(() => console.log("database connection problem -> ", err));

// middlewares
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

// routes
app.use("/user", userRouter);
app.get("/", (req, res) => {
  return res.render("home", {
    user: req.user,
  });
});

// server port
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
