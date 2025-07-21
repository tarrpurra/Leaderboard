import cors from "cors";
import express, { json } from "express";
import dotenv from "dotenv";
import DBconnect from "./db/dbConnection.js";
import player from "./Routes/Playerpoints.js";
import history from "./Routes/history.js";
dotenv.config();

const PORT = process.env.PORT;
const app = express();
app.use(
  cors({
    origin: "https://leaderboardassign.netlify.app", // or use '*' for dev/testing
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(json());

DBconnect(); //connecting to the DB

app.use("/", player);
app.use("/history", history);

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
