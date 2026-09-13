import { categoriesTypes, category } from "#/util/audio_category";
import { Model, model, Types, Schema, ObjectId, models } from "mongoose";

export interface AudioDocument<T = Types.ObjectId> {
    _id: Types.ObjectId;
    title: string;
    about: string;
    owner: T;
    file: {
        url: string;
        publicId: string
    }
    poster?: {
        url: string;
        publicId: string
    };
    likes: ObjectId[];
    category: categoriesTypes,
    createdAt:Date
}
const AudioSchema = new Schema<AudioDocument>({
    title: {
        type: String,
        require: true
    },
    about: {
        type: String,
        require: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    file: {
        type: Object,
        url: String,
        publicId: String,
        required: true
    },
    poster: {
        type: Object,
        url: String,
        publicId: String
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],
    category: {
        type: String,
        enum: category,
        default: "other"

    }
}, {
    timestamps: true,
});
const Audio = models.Audio || model("audio", AudioSchema);
export default Audio as Model<AudioDocument>;