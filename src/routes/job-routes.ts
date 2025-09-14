import { Router, Request, Response } from "express";
import { Fetchjobs } from "../services/job-services";

const jobrouter = Router();

jobrouter.get("/", async (req: Request, res: Response) => {
  try {
    const newJobs = await Fetchjobs();
    res.status(200).json({ count: newJobs.length, jobs:newJobs});
    return;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to get data" });
  }
});

export default jobrouter;
