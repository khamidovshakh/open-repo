const mongoose = require("mongoose");

const Teachers = mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "teacher",
    },
    password: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "/default/avatar.jpg",
    },
    groups: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Groups",
    },
    transactions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Transactions",
    },
    reviews: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Reviews",
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

module.exports = mongoose.model("Teachers", Teachers);
