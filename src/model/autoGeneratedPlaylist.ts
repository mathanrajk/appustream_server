import { Model, model, models, ObjectId, Schema,Types } from "mongoose";

export interface AutoPlaylistDocument{
    title:string;
    items:ObjectId[];
}

const AutoPlaylistSchema= new Schema<AutoPlaylistDocument>({

    title:{
        type:String,
        required:true
    },
    items:[
        {
            type:Schema.Types.String,
            required:true,
            ref:"audio"
        }
    ],

},{
    timestamps:true
});

const autoPlaylist = models.playlist||model("autoPlaylist",AutoPlaylistSchema);

export default autoPlaylist as Model<AutoPlaylistDocument>;