const mongoose = require("mongoose");

const Users = mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "user",
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
    groups: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Groups",
    },
    lcid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningCenters",
      required: true,
    },
    balance: {
      type: Number,
      default: 100,
    },
    transactions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Transactions",
    },
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the last updated date
    },
  }
);

module.exports = mongoose.model("Users", Users);
