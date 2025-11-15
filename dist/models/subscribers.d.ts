import mongoose, { Document } from "mongoose";
export interface ISubscriber extends Document {
    chatId: number;
    createdAt: Date;
}
export declare const Subscriber: mongoose.Model<ISubscriber, {}, {}, {}, mongoose.Document<unknown, {}, ISubscriber, {}, {}> & ISubscriber & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=subscribers.d.ts.map