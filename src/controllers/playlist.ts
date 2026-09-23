import { createPlaylistRequest, populateFavList, updatePlaylistRequest } from "#/@types/audio";
import Audio from "#/model/audio";
import Favorite from "#/model/favorite";
import Playlist from "#/model/playlist";
import { RequestHandler } from "express";
import { isValidObjectId, Types } from "mongoose";


export const createPlaylist: RequestHandler = async (req: createPlaylistRequest, res) => {
    const { title, resId, visibility } = req.body;
    const onwerId = req.user?.id;
    if (resId) {
        const audio = await Audio.findById(resId);
        if (!audio) return res.status(404).json({ error: "Could not found the audio" })

    }
    const newPlaylist = new Playlist({
        title,
        owner: onwerId,
        visibility
    })

    if (resId) newPlaylist.items = [new Types.ObjectId(resId) as any];
    await newPlaylist.save();

    res.status(201).json({
        playlist: {
            id: newPlaylist._id,
            title: newPlaylist.title,
            visibility: newPlaylist.visibility
        }
    })

}
export const updatePlaylist: RequestHandler = async (req: updatePlaylistRequest, res) => {

    const { id, item, title, visibility } = req.body;
    const playlist = await Playlist.findOneAndUpdate({ _id: id, owner: req.user?.id }, { title, visibility }, { new: true });

    if (!playlist) return res.status(404).json({ error: "Playlist not found:)" });

    if (item) {
        const audio = await Audio.findById(item);
        if (!audio) return res.status(404).json({ error: "audio not found:)" });
        await Playlist.findOneAndUpdate(playlist._id, {
            $addToSet: {
                items: item
            }
        })
    }
    res.status(201).json({
        playlist: {
            id: playlist._id,
            title: playlist.title,
            visibility: playlist.visibility
        }
    })

}
export const removePlaylist: RequestHandler = async (req, res) => {
    const { playlistId, resId, all } = req.query;

    if (!isValidObjectId(playlistId)) return res.status(422).json({ error: "Invalid playlist ID :)" });
    if (all === "yes") {
        const playlist = await Playlist.findOneAndDelete({
            _id: playlistId,
            owner: req.user?.id
        })
        if (!playlist) return res.status(404).json({ error: "Playlist not found :)" });

    }
    if (resId) {
        if (!isValidObjectId(playlistId)) return res.status(422).json({ error: "Invalid playlist ID :)" });
        const playlist = await Playlist.findOneAndUpdate({ _id: playlistId, owner: req.user?.id }, {
            $pull: {
                items: resId
            }
        })
        if (!playlist) return res.status(404).json({ error: "Playlist not found :)" });

    }
    res.json({ success: true })

}

export const getPlaylistByProfile: RequestHandler = async (req, res) => {
    const { pageNo = "0", limit = "20" } = req.query as { pageNo: string, limit: string };
    const data = await Playlist.find({
        owner: req.user?.id,
        visibility: { $ne: "auto" },
    }).skip(parseInt(pageNo) * parseInt(limit)).limit(parseInt(limit)).sort("-createedAt");

    const profile = data.map((item) => {
        return {
            id: item._id,
            title: item.title,
            itemsCount: item.items.length,
            visibility: item.visibility
        }
    })
    res.json({ profile });
}
export const getAudios: RequestHandler = async (req, res) => {
    const { playlistId } = req.params;
    if (!isValidObjectId(playlistId)) return res.status(422).json({ error: "invalid playlist Id :)" })

    const playlist = await Playlist.findOne({ _id: playlistId, owner: req.user?.id }).populate<{ items: populateFavList[] }>({
        path: "items",
        populate: {
            path: "owner",
            select: "name"
        }
    });
    if (!playlist) return res.json({ list: [] });

    const audios = playlist.items.map((item) => {
        return {
            id: item._id,
            title: item.title,
            category: item.category,
            file: item.file.url,
            poster: item.poster?.url,
            owner: {
                name: item.owner.name,
                id: item.owner._id
            }
        }
    })
    res.status(201).json({
        id: playlist?._id,
        title: playlist?.title,
        audios
    })
}