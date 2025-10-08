import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  id: string;
  title: string;
  company: string;
  link: string;
  dateposted?: string;
  source: string;
  createdAt: Date;
}

const Jobschema = new Schema<IJob>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  link: { type: String, required: true },
  source: { type: String, required: true },
  dateposted: { type: String },
  createdAt: { type: Date, default: Date.now },
});


export const JobModel = mongoose.model<IJob>("Job",Jobschema)