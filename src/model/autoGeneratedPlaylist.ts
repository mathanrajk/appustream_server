import { Model, model, models, ObjectId, Schema, Types } from "mongoose";

export interface AutoPlaylistDocument {
  title: string;
  items: ObjectId[];
  visibility: "auto" | "public";
}

const AutoPlaylistSchema = new Schema<AutoPlaylistDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "audio",
      },
    ],
    visibility: {
      type: String,
      enum: ["auto", "public"],
      default: "auto",
    },
  },
  {
    timestamps: true,
  }
);

const autoPlaylist =
  models.autoPlaylist || model("autoPlaylist", AutoPlaylistSchema);

export default autoPlaylist as Model<AutoPlaylistDocument>;
