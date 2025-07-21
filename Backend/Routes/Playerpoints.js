import express from "express";
import User from "../model/User.model.js";
import History from "../model/History.js";

const player = express.Router();

// GET /leaderboard - Return all users sorted by points descending
player.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /leaderboard/:userId - Return player details by userId
player.get("/leaderboard/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ UserId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// post to add random points
player.post("/leaderboard/claim/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ UserId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const random = Math.floor(Math.random() * 11);
    user.points += random;
    await user.save();
    // Add to history log
    await History.create({
      userId: user._id,
      name: user.UserName,
      points: random,
    });
    res.json({ user, added: random });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Create new user with random points
player.post("/profile/user", async (req, res) => {
  try {
    const { UserName } = req.body;
    if (!UserName) {
      return res.status(400).json({ message: "UserName is required" });
    }
    const randomPoints = Math.floor(Math.random() * 101); // 0-100
    // Find the max UserId and increment for uniqueness
    const lastUser = await User.findOne().sort({ UserId: -1 });
    const nextUserId = lastUser ? lastUser.UserId + 1 : 1;
    const newUser = new User({
      UserId: nextUserId,
      UserName,
      points: randomPoints,
    });
    await newUser.save();
    res.status(201).json({ user: newUser, points: randomPoints });
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Add user with specified UserName and points
player.post("/addus", async (req, res) => {
  try {
    const { UserName, points } = req.body;
    if (!UserName) {
      return res.status(400).json({ message: "UserName is required" });
    }
    // Find the max UserId and increment for uniqueness
    const lastUser = await User.findOne().sort({ UserId: -1 });
    const nextUserId = lastUser ? lastUser.UserId + 1 : 1;
    const newUser = new User({
      UserId: nextUserId,
      UserName,
      points: points || 0,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default player;
