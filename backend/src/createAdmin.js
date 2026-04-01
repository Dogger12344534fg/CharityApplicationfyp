// createAdmin.js — run with: node createAdmin.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/setu";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    confirmPassword: String,
    role: { type: String, default: "user" },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const existing = await User.findOne({ email: "admin@setu.com" });
    if (existing) {
      console.log("⚠️  Admin already exists:", existing.email);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Admin@123", salt);

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@setu.com",
      password: hashedPassword,
      confirmPassword: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created successfully!");
    console.log("   Name: ", admin.name);
    console.log("   Email:", admin.email);
    console.log("   Role: ", admin.role);
    console.log("\n   Login with:");
    console.log("   Email:    admin@setu.com");
    console.log("   Password: Admin@123");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB disconnected");
    process.exit(0);
  }
}

createAdmin();
