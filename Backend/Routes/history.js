import express from "express";
import History from "../model/History.js";

const history = express.Router();

// API for history logs

history.get("/claim-history", async (req, res) => {
  try {
    const logs = await History.find().sort({ date: -1 }); 
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default history;
