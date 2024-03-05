const { Router } = require("express");
const User = require("../models/user");

const router = Router();

// login === signin
router.get("/signin", (req, res) => {
  return res.render("signin");
});
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    // console.log(token);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "incorrect Email or Password",
    });
  }
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
    return res.status(400).json({ message: "router.post " });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
