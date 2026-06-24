const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    area: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Reported", "Under Review", "In Progress", "Resolved"],
      default: "Reported",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    supportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    location: {
      latitude: Number,
      longitude: Number,
    },

    geoLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({
  geoLocation: "2dsphere",
});

module.exports = mongoose.model("Post", postSchema);