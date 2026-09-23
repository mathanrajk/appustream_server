import { populateFavList } from "#/@types/audio";
import { paginationQuery } from "#/@types/misc";
import Audio, { AudioDocument } from "#/model/audio";
import Favorite from "#/model/favorite";
import { category } from "#/util/audio_category";
import { RequestHandler } from "express";
import { isValidObjectId, MergePopulatePaths, ObjectId } from "mongoose";

export const toggleFavorite: RequestHandler = async (req, res) => {
    const audioId = req.query.audioId as string;
    let status: 'added' | 'removed';
    if (!isValidObjectId(audioId)) return res.status(422).json({ error: "Audio id is invalid :)" });
    const audio = await Audio.findById(audioId);
    if (!audio) return res.status(404).json({ error: "Resources not found!" });
    const alreadyExists = await Favorite.findOne({ owner: req.user?.id, items: audioId });
    console.log(alreadyExists)
    if (alreadyExists) {
        await Favorite.updateOne({ owner: req.user?.id }, { $pull: { items: audioId } })
        status = "removed"
    }
    else {
        const favorite = await Favorite.findOne({ owner: req.user?.id });
        if (favorite) {

            await Favorite.updateOne({ owner: req.user?.id }, {
                $addToSet: { items: audioId }
            })

        } else {
            await Favorite.create({ owner: req.user?.id, items: [audioId] });
        }
        status = "added";
    }

    if (status === "added") {
        await Audio.findByIdAndUpdate(audioId, {
            $addToSet: { likes: req.user?.id }
        });
    }

    if (status === "removed") {
        await Audio.findByIdAndUpdate(audioId, {
            $pull: { likes: req.user?.id }
        });
    }
    res.json({ status })

}
export const getFavorites: RequestHandler = async (req, res) => {
    const userId = req.user?.id;
    const {limit="20", pageNo ="0"} = req.query as paginationQuery
    const favorite = await Favorite.aggregate([
        {$match:{owner :userId}},
        {$project:{
            audioIds:{
                $slice:["$items",parseInt(limit)*parseInt(pageNo),parseInt(limit)]
            }
        }
    },
    {
        $unwind:"$audioIds"
    },{
        $lookup:{
            from:"audios",
            localField:"audioIds",
            foreignField:"_id",
            as:"audioInfo"
        }
    },{
        $unwind:"$audioInfo"
    },{
        $lookup:{
            from:"users",
            localField:"audioInfo.owner",
            foreignField:"_id",
            as:"ownerInfo"
        }
    },{
        $unwind:"$ownerInfo"
    },{
        $project:{
            _id:0,
            id:"$audioInfo._id",
            title:"$audioInfo.title",
            about:"$audioInfo.about",
            file:"$audioInfo.file.url",
            poster:"$audioInfo.poster.url",
            onwer:{
                name :"$ownerInfo.name",
                id:"$ownerInfo._id",
            }
        }
    }
    ])


     res.json({ favorite })

}
export const getIsFavorite: RequestHandler = async (req, res) => {
    const audioId = req.query.audioId as string;
    if (!isValidObjectId(audioId)) return res.status(422).json({ error: "Invalid audio Id :)" });
    const favorite = await Favorite.findOne({ owner: req.user?.id, items: audioId })
    res.json({ result: favorite ? true : false });
}