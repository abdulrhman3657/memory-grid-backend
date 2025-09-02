import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    reqMethod: { type: String },
    country: { type: String },
    city: { type: String },
  },
  { timestamps: true } // will auto-save createdAt and updatedAt
);

const User = mongoose.model("User", userSchema);

export default User;