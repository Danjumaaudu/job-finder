import mongoose, { Schema, Document } from "mongoose";
import { IJob } from "./jobmodels";



const Jobschema = new Schema<IJob>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  link: { type: String, required: true },
  source: { type: String, required: true },
  dateposted: { type: String },
  createdAt: { type: Date, default: Date.now },
});


export const JobberManModel = mongoose.model<IJob>("JobberMan",Jobschema)