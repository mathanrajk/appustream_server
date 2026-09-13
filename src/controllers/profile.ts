import { paginationQuery } from "#/@types/misc";
import Audio, { AudioDocument } from "#/model/audio";
import Playlist from "#/model/playlist";
import User from "#/model/user";
import { RequestHandler } from "express";
import { isValidObjectId, ObjectId, Types } from "mongoose";

export const updateFollower: RequestHandler = async (req, res) => {
    const { profileId } = req.params;
    let status: "added" | "removed";
    if (!isValidObjectId(profileId)) return res.status(422).json({ error: "Invalid profile id :)" });

    const profile = await User.findById(profileId);
    if (!profile) return res.status(404).json({ error: "Profile not found :)" });

    const alreadyaFollower = await User.findOne({ _id: profile._id, followers: req.user?.id });

    if (alreadyaFollower) {
        await User.updateOne({ _id: profile._id }, { $pull: { followers: req.user?.id } });
        status = "removed";
    }
    else {
        await User.updateOne({ _id: profile._id }, { $addToSet: { followers: req.user?.id } });
        status = "added"
    }

    if (status === "added") {
        await User.updateOne({ _id: req.user?.id }, { $addToSet: { followings: profile._id } });
    }
    if (status === "removed") {
        await User.updateOne({ _id: req.user?.id }, { $pull: { followings: profile._id } });
    }

    res.json({ status })
}

export const getUploads: RequestHandler = async (req, res) => {
    const { pageNo = "0", limit = "20" } = req.query as paginationQuery;

    const data = await Audio.find({ owner: req.user?.id }).skip(parseInt(pageNo) * parseInt(limit)).limit(parseInt(limit)).sort("-createdAt");

    const audios = data.map((item) => {
        return {
            id: item._id,
            title: item.title,
            about: item.about,
            file: item.file.url,
            poster: item.poster?.url,
            date: item.createdAt,
            owner: {
                name: req.user?.name,
                id: req.user?.id
            }
        }

    });

    res.json({ audios });
}


export const getPublicUploads: RequestHandler = async (req, res) => {
    const { pageNo = "0", limit = "20" } = req.query as paginationQuery;
    const { profileId } = req.params;
    if (!isValidObjectId(profileId)) return res.status(422).json({ error: "Invalid Profile Id :)" })
    const id = Array.isArray(profileId) ? profileId[0] : profileId;
    const currentProfile = new Types.ObjectId(id);
    const data = await Audio.find({ owner: currentProfile }).skip(parseInt(pageNo) * parseInt(limit)).limit(parseInt(limit)).sort("-createdAt").populate<{ owner: { name: string; _id: ObjectId } }>("owner");

    const audios = data.map((item) => {
        return {
            id: item._id,
            title: item.title,
            about: item.about,
            file: item.file.url,
            poster: item.poster?.url,
            date: item.createdAt,
            owner: {
                name: item.owner.name,
                id: item.owner._id
            }
        }

    });

    res.json({ audios });
}

export const getPublicProfile: RequestHandler = async (req, res) => {
    const { profileId } = req.params;
    if (!isValidObjectId(profileId)) return res.status(422).json({ error: "Invaild Profile Id :)" });
    const user = await User.findById(profileId);
    if (!user) return res.status(422).json({ error: "User not found :)" });
    res.json({
        profile: {
            id: user._id,
            name: user.name,
            followers: user.followers.length,
            followings: user.followings.length,
            avatar: user.avatar?.url
        }
    })

}

export const getPublicPlaylist: RequestHandler = async (req, res) => {
    const { profileId } = req.params;
    const { pageNo = "0", limit = "20" } = req.query as paginationQuery;

    if (!isValidObjectId(profileId)) return res.status(422).json({ error: "Invalid Profile ID :)" });
  const id = Array.isArray(profileId) ? profileId[0] : profileId;
    const currentProfile = new Types.ObjectId(id);
    const playlist = await Playlist.find({
        owner: currentProfile,
        visibility: "public"
    }).skip(parseInt(pageNo) * parseInt(limit)).limit(parseInt(limit)).sort("-createdAt");
console.log(playlist)
    if (!playlist) return res.json({ playlist: [] });
    res.json({
        playlist: playlist.map((item) => {
            return {
              id:item._id,
              title:item.title,
              itemsCount:item.items.length,
              visibility:item.visibility,
            }
        })
    })



}