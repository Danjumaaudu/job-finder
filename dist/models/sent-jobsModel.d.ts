import mongoose, { Document } from "mongoose";
export interface Sentjobs extends Document {
    chatId: Number;
    jobId: string;
    sentAt: Date;
}
export declare const SentJobsModel: mongoose.Model<Sentjobs, {}, {}, {}, mongoose.Document<unknown, {}, Sentjobs, {}, {}> & Sentjobs & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=sent-jobsModel.d.ts.map