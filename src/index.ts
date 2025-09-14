import express, { Request, Response } from "express";
import jobrouter from "./routes/job-routes";

const app = express();

const PORT = 5000;

app.use("/jobs",jobrouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
