import mongoose from "mongoose";

const savedExplanationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    ipAddress: {
      type: String,
      required: true
    },
    cidr: {
      type: Number,
      required: true,
      min: 0,
      max: 32
    },
    results: {
      subnetMask: String,
      networkAddress: String,
      broadcastAddress: String,
      firstUsableHost: String,
      lastUsableHost: String,
      totalAddresses: Number,
      usableHosts: Number
    },
    explanation: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
const SavedExplanation = mongoose.model(
  "SavedExplanation",
  savedExplanationSchema
);

export default SavedExplanation;