import { Model, model, models, ObjectId, Schema,Types } from "mongoose";

export interface PlaylistDocument{
    title:string;
    owner:Types.ObjectId;
    items:ObjectId[];
    visibility:"public"|"private"|"auto";
}

const PlaylistSchema= new Schema<PlaylistDocument>({

    title:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"user"
    },
    items:[
        {
            type:Schema.Types.String,
            required:true,
            ref:"audio"
        }
    ],
    visibility:{
        type:String,
        emun:["public","private","auto"],
        default:"public"
    }

},{
    timestamps:true
});

const playlist = models.playlist||model("Playlist",PlaylistSchema);

export default playlist as Model<PlaylistDocument>;