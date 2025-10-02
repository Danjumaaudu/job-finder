import mongoose ,{ Schema, Document} from "mongoose";


export interface ISubscriber extends Document {
    chatId: number;
    createdAt: Date;
}
 

const subscriberSchema = new Schema<ISubscriber>({
    chatId : {type: Number, required : true, unique: true},
    createdAt: {type: Date, default: Date.now},
});


export const Subscriber = mongoose.model<ISubscriber>(
    "subscriber",
    subscriberSchema
)