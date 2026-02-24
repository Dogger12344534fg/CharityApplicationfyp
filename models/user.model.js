const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["learner", "vendor", "admin"],
      default: "learner",
    },

    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      required: function () {
        // Only required for vendors
        return this.role === "vendor";
      },
    },

    location: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;