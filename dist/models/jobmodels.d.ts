import mongoose, { Document } from "mongoose";
export interface IJob extends Document {
    id: string;
    title: string;
    company: string;
    link: string;
    dateposted?: string;
    source: string;
    createdAt: Date;
}
export declare const JobModel: mongoose.Model<IJob, {}, {}, {}, mongoose.Document<unknown, {}, IJob, {}, {}> & IJob & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=jobmodels.d.ts.map