const mongoose = require("mongoose");

const LearningCenters = mongoose.Schema(
  {
    plan: {
      type: String,
      enum: ["start", "pro"],
      default: "start",
    },
    title: {
      type: String,
      required: true,
    },
    foundationYear: {
      type: Number,
      default: 2024,
    },
    locations: {
      type: [
        {
          title: String,
          location: String,
        },
      ],
    },
    contacts: {
      type: {
        callCenter: String,
        techSupport: String,
        additional: String,
      },
    },
    logo: {
      type: {
        white: {
          url: String,
        },
        black: {
          url: String,
        },
      },
    },

    // active models
    functions: {
      type: {
        leaderBoard: {
          type: Boolean,
          default: false,
        },
        gamification: {
          type: Boolean,
          default: false,
        },
        stories: {
          type: Boolean,
          default: false,
        },
        shop: {
          type: Boolean,
          default: false,
        },
        sms: {
          type: Boolean,
          default: false,
        },
      },
    },

    courses: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Courses",
    },
    groups: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Groups",
    },

    // Shop as service
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shops",
    },

    // People
    teachers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Teachers",
    },
    admins: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Admins",
    },
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Users",
    },

    // Telegram
    telegram: {
      analytics: {
        chatId: "",
        botToken: "",
      },
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("LearningCenters", LearningCenters);
