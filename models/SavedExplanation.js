import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    subnetMask: {
      type: String,
      required: true
    },
    networkAddress: {
      type: String,
      required: true
    },
    broadcastAddress: {
      type: String,
      required: true
    },
    firstUsableHost: {
      type: String,
      default: ""
    },
    lastUsableHost: {
      type: String,
      default: ""
    },
    totalAddresses: {
      type: Number,
      required: true
    },
    usableHosts: {
      type: Number,
      required: true
    }
  },
  {
    _id: false
  }
);
const savedExplanationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    ipAddress: {
      type: String,
      required: true,
      trim: true
    },
    cidr: {
      type: Number,
      required: true,
      min: 0,
      max: 32
    },
    results: {
      type: resultSchema,
      required: true
    },
    explanation: {
      type: String,
      required: true,
      trim: true
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