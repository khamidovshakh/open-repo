const mongoose = require("mongoose");

const Courses = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    lessons: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Lessons",
    },
    groups: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Groups",
    },
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Users",
    },
    image: {
      type: String,
      default: "/default/course-preview.jpg",
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

module.exports = mongoose.model("Courses", Courses);
