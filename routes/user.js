const { Router } = require("express");
const User = require("../models/user");

const router = Router();

// login === signin
router.get("/signin", (req, res) => {
  return res.render("signin");
});
// login === signin
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    await User.create({
      fullName,
      email,
      password,
    })
      .then((data) => console.log("user created", { data: data }))
      .catch((error) => console.log(error));
    return res.status(308).redirect("/");
  } catch (error) {
    return res.status(400).json({ message: "router.post " + error });
  }
});

module.exports = router;
