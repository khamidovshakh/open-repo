const mongoose = require("mongoose");

const Lessons = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      // 0 - next
      // 1 - completed
      enum: [0, 1],
      default: 0,
    },
    rating: {
      type: [
        {
          stars: Number,
          text: String,
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
          },
        },
      ],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Lessons", Lessons);
