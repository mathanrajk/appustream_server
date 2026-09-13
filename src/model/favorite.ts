import { Model, model, models, ObjectId, Schema, Types } from "mongoose";

interface FavoriteDocument {
  owner: Types.ObjectId;
  items: Types.ObjectId[];
}

const favoriteSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    items: {
        type: [{ type: Schema.Types.ObjectId, ref: "Audio" }],
    }
}, { timestamps: true });

const Favorite = models.Favorite || model("Favorite", favoriteSchema);
export default Favorite as Model<FavoriteDocument>;