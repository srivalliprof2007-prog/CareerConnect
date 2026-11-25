
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      default: ""
    },

    college: {
      type: String,
      default: ""
    },

    skills: {
      type: String,
      default: ""
    },

    preferredCategory: {
      type: String,
      default: "All categories"
    },

    preferredLocation: {
      type: String,
      default: ""
    },

    preferredType: {
      type: String,
      default: "All types"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
