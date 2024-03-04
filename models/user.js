const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("node:crypto");

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
    const user = this;
    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
      .update(user.password)
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

// userSchema.static("matchPass")

const User = mongoose.model("user", userSchema);
module.exports = User;
