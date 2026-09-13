import { Model, model, models, ObjectId, Schema } from "mongoose";
import { number } from "yup";
export type historyType = { audio: ObjectId, progress: number, date: Date }

interface HistotyDocument {
    owner: ObjectId;
    last: historyType;
    all: historyType[];
}
const historySchema = new Schema<HistotyDocument>({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    last: {
        audio: {
            type: Schema.Types.ObjectId,
            ref: "audio"
        },
        progress: {
            type: Number
        },
        date: {
            type: Date,
            required: true,
        }
    },
    all: [
        {
            audio: {
                type: Schema.Types.ObjectId,
                ref: "audio"
            },
            progress: {
                type: Number
            },
            date: {
                type: Date,
                required: true,
            }
        }
    ]

}, { timestamps: true });

const History = models.History || model("history", historySchema);

export default History as Model<HistotyDocument>;