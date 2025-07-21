import mongoose from "mongoose";

// Creating History Schema
const HistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserInfo", 
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const History = mongoose.model("HistoryInfo", HistorySchema);
export default History;
