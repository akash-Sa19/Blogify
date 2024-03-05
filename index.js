// node function import
const path = require("node:path");

// importing Routes
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
// other imports
const mongoose = require("mongoose");
const Blog = require("./models/blog");
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
// without this middleware, we will be unabe to load all the html in the project, since we are using "ejs" we have to give a path to all the views that we want to use
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// this middleware will help in parsing all type of data that comes from the user
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
// custom middleware -> checks if user is authentication
app.use(checkForAuthenticationCookie("token"));
// "express.static" is used to serve static files like images and etc, without this middleware express will treat paths of the images as action -> path and method -> get
app.use(express.static(path.resolve("./public")));

// routes
app.use("/user", userRouter);
app.use("/blog", blogRouter);

// homepage route
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

// server port
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
