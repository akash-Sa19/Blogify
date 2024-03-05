const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("node:crypto");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/profile-pic.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  try {
    // const user = this;
    // this refers to "User" collection of the database
    if (!this.isModified("password")) return;

    const salt = randomBytes(16).toString();
    // const salt = "randomSalt";
    const hashedPassword = createHmac("sha256", salt)
      .update(this.password)
      .digest("hex");
    if (!hashedPassword) {
      return new Error("Error -> hashedPassword not obtained");
    }
    this.salt = salt;
    this.password = hashedPassword;
    next();
  } catch (error) {
    return new Error("Error -> userSchema.pre => ", error);
  }
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    console.log("user found", user);
    if (!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userPovidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== userPovidedHash) {
      throw new Error("Password incorrect");
    }
    const token = createTokenForUser(user);
    return token;
  }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
