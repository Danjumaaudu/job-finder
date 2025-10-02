import express, { Request, Response } from "express";
import jobrouter from "./routes/job-routes";
import "./telegram-bot";

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("bot successfully running....🐱‍🏍");
});
app.use("/jobs", jobrouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
