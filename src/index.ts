import express, { Request, Response } from "express";
import jobrouter from "./routes/job-routes";
import { startScheduler } from "./utils/scheduler";
import bot from "./telegram-bot";

const app = express();

const PORT = 5000;

app.use(express.json());
app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
app.get("/", (req, res) => {
  res.send("bot successfully running....🐱‍🏍");
});

app.use("/jobs", jobrouter);
async function bootstrap() {
  await bot.setWebHook(
    `https://job-finder-4-i6tq.onrender.com/bot${process.env.BOT_TOKEN}`
  );

  startScheduler();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

bootstrap();
