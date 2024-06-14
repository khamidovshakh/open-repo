const mongoose = require("mongoose");

const Admins = mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager"],
      default: "admin",
    },
    password: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
    },
    sex: {
      // male, female
      type: String,
    },
    avatar: {
      type: String,
      default: "/default/avatar.jpg",
    },
    lcid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningCenters",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the last updated date
    },
  }
);

module.exports = mongoose.model("Admins", Admins);
