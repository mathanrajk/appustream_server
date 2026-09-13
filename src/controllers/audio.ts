import cloudinary from "#/cloude";
import { RequesWithFiles } from "#/middleware/fileParser";
import { RequestHandler } from "express"
import formidable from "formidable";
import Audio from "#/model/audio"
import { Types } from "mongoose";
interface CreateAudioRequest extends RequesWithFiles {
    body: {
        title: string;
        about: string;
        category: string
    }
}

export const createAudio: RequestHandler = async (req: CreateAudioRequest, res) => {
    const { title, about, category } = req.body;
    const poster = req.files?.poster as formidable.File;
    const audioFile = req.files?.file as formidable.File;
    const ownerId = req.user?.id;

    if (!audioFile) return res.status(422).json({ error: "Audio file is missing :)" })
    const audioRes = await cloudinary.uploader.upload(audioFile.filepath, {
        resource_type: "video"
    });
    const newaudio = new Audio(
        {
            title,
            about,
            category,
            owner: ownerId,
            file: { url: audioRes.url, publicId: audioRes.public_id }

        }
    );
    if (poster) {
        const posterRes = await cloudinary.uploader.upload(poster.filepath, {
            width: 300,
            heigth: 300,
            crop: "thumb",
            gravity: "face"
        })
        newaudio.poster = {
            url: posterRes.url,
            publicId: posterRes.public_id
        }
    }
    await newaudio.save();

    res.status(201).json({
        audio: {
            title,
            about,
            category,
            file: newaudio.file.url,
            poster: newaudio.poster?.url
        }
    })

}

export const updateAudio: RequestHandler = async (req: CreateAudioRequest, res) => {
    const { title, about, category } = req.body;
    const poster = req.files?.poster as formidable.File;
    const ownerId = req.user?.id;
    const rawAudioId = req.params.audioId;
    const audioId = Array.isArray(rawAudioId) ? rawAudioId[0] : rawAudioId;
    const audio = await Audio.findOneAndUpdate({ owner: ownerId,_id: new Types.ObjectId(audioId), }, { title, about, category }, { new: true });
    if (!audio) return res.status(404).json({ error: "Record not found" });
    if (poster) {
        if (audio.poster?.publicId) {
            await cloudinary.uploader.destroy(audio.poster?.publicId);
        }

        const posterRes = await cloudinary.uploader.upload(poster.filepath, {
            width: 300,
            heigth: 300,
            crop: "thumb",
            gravity: "face"
        })
        audio.poster = {
            url: posterRes.url,
            publicId: posterRes.public_id
        }
    }
    await audio.save();

    res.status(201).json({
        audio: {
            title,
            about,
            category,
            file: audio.file.url,
            poster: audio.poster?.url
        }
    })

}