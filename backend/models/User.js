const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    impactScore: {
      type: Number,
      default: 0,
    },

    issuesReported: {
      type: Number,
      default: 0,
    },

    issuesSupported: {
      type: Number,
      default: 0,
    },

    achievements: [
      {
        type: String,
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["citizen", "admin"],
      default: "citizen",
    },
    area: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);