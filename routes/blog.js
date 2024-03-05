const multer = require("multer");
const path = require("node:path");
const { Router } = require("express");
const Blog = require("../models/blog");
const Comments = require("../models/comments");

const router = Router();

// multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id).populate("createdBy");
  const comments = await Comments.find({ blogId: id }).populate("createdBy");
  console.log(comments);
  //   console.log(blog);
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  //   console.log(req.body);
  //   console.log(req.file);
  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
  //   return res.redirect("/blog/");
});

router.post("/comment/:blogId", async (req, res) => {
  await Comments.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
