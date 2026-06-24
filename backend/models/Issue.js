const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Road", "Water", "Electricity", "Garbage", "Other"],
      default: "Other",
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    beforeImage: {
      type: String,
      default: "",
    },
    afterImage: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Under Review", "In Progress", "Resolved"],
      default: "Pending",
    },
    locationDetails: {
      latitude: Number,
      longitude: Number,
    },
    geoLocation: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [79.0882, 21.1458], // default coordinates
      },
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    supporters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    adminNotes: {
      type: String,
      default: "",
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Issue", issueSchema);