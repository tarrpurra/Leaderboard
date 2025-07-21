import mongoose from "mongoose";
// Creating ser Schema
const UserSchema = new mongoose.Schema({
  UserId: {
    type: Number,
    required: true,
    unique: true,
    default: 0,
  },
  UserName: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  stamp: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("UserInfo", UserSchema);
export default User;
