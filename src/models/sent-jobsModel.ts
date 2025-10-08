import mongoose, { Schema, Document } from "mongoose";
import { DatabaseSync } from "node:sqlite";

export interface Sentjobs extends Document {
    chatId: Number;
  jobId: string;
  sentAt: Date;
}

const sentJobSchema = new Schema<Sentjobs>({
    chatId: { type:Number, required : true},
  jobId: { type: String, required: true, unique: true },
  sentAt: { type: Date, default: Date.now },
});
 sentJobSchema.index({chatId:1, jobId:1}, {unique:true});
export const SentJobsModel = mongoose.model<Sentjobs>(
  "SentJobs",
  sentJobSchema
);
