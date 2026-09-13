import { RequestHandler } from "express";
import History, { historyType } from "#/model/history";
import { currentday } from "#/util/helper";
import { paginationQuery } from "#/@types/misc";
import { PipelineStage } from "mongoose";

export const updateHistory: RequestHandler = async (req, res) => {
    const oldHistory = await History.findOne({ owner: req.user?.id });
    const { audio, progress, date } = req.body;
    const ownerId = req.user?.id;
    const history: historyType = { audio, progress, date };
    if (!oldHistory) {
        await History.create({
            owner: ownerId,
            last: history,
            all: [history],
        });
        return res.json({ success: true });
    }
    console.log(currentday())
    const histories = await History.aggregate([
        {
            $match: { owner: ownerId }
        },
        {
            $unwind: "$all"
        },
        {
            $match: {
                "all.date": {
                    $gte: currentday().startOfDay,
                    $lt: currentday().endOfDay
                },
            },
        }, {
            $project: {
                _id: 0,
                audio: "$all.audio"
            }
        }
    ])
    const sameDayHistory = histories.find((item) => {
        if (item.audio.toString() === audio) return item;
    })

    if (sameDayHistory) {
        await History.findOneAndUpdate({
            owner: ownerId,
            "all.audio": audio

        }, {
            $set: {
                "all.$.progress": progress,
                "all.$.date": date
            }
        })
    } else {
        await History.findByIdAndUpdate(oldHistory._id, {
            $push: { all: { $each: [history], $position: 0, $slice: 100 } },
            $set: { last: history }
        })
    }
    res.json({ success: true })
}

export const removeHistory: RequestHandler = async (req, res) => {
    const removeAll = req.query.all === "yes";
    const ownerId = req.user?.id;
    if (removeAll) {
        await History.findOneAndDelete({ owner: ownerId });
        return res.json({ success: true })
    }
    const histories = req.query.histories as string;
    const ids = JSON.parse(histories) as string[];
    await History.findOneAndUpdate({
        owner: ownerId
    }, {
        $pull: {
            all: {
                _id: ids
            }
        }
    })
    res.json({ success: true })
}
export const getHistories: RequestHandler = async (req, res) => {
    const { limit = "20", pageNo = "0" } = req.query as paginationQuery;

    const ownerMatch = { $match: { owner: req.user?.id } };
    const pagenations = {
        $project: {
            all: {
                $slice: ["$all", parseInt(limit) * parseInt(pageNo), parseInt(limit)]
            }
        }
    }
    const unwindAll = { $unwind: "$all" }
    const lookupAudio = {
        $lookup: {
            from: "audios",
            localField: "all.audio",
            foreignField: "_id",
            as: "audioInfo"
        }
    }
    const unwindAudioInfo = {
        $unwind: "$audioInfo"
    }
    const projectAll = {
        $project: {
            _id: 0,
            id: "$all._id",
            audioId: "$audioInfo._id",
            date: "$all.date",
            title: "$audioInfo.title"
        }
    }
    const groupAudio = {
        $group: {
            _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$date" }
            },
            audios: { $push: "$$ROOT" }
        }
    }
    const projectfinal = {
        $project: {
            _id: 0,
            id: "$id",
            date: "$_id",
            audios: "$$ROOT.audios"

        }
    }
    const sortDate: PipelineStage = {
        $sort: { date: -1 }
    }
    const histories = await History.aggregate([
        ownerMatch,
        pagenations,
        unwindAll,
        lookupAudio,
        unwindAudioInfo,
        projectAll,
        groupAudio,
        projectfinal,
        sortDate]);

    res.json({ histories })
}
export const getRecentlyPlayed: RequestHandler = async (req, res) => {
    const data = await History.aggregate([
        {
            $match: { owner: req.user?.id }
        },
        {
            $project: {
                myHistory: { $slice: ["$all", 10] }
            }
        },
        {
            $project: {
                histories: {
                    $sortArray: {
                        input: "$myHistory",
                        sortBy: { date: -1 }
                    }
                }
            }
        }, {
            $unwind: {
                path: "$histories",
                includeArrayIndex: "index"
            }
        }, {
            $lookup: {
                from: "audios",
                localField: "histories.audio",
                foreignField: "_id",
                as: "audioInfo"
            }
        }, {
            $unwind: "$audioInfo"
        }, {
            $lookup: {
                from: "users",
                localField: "audioInfo.owner",
                foreignField: "_id",
                as: "owner"
            }
        }, {
            $unwind: "$owner"
        }, {
            $project: {
                _id: 0,
                id: "$audioInfo._id",
                title: "$audioInfo.title",
                about: "$audioInfo.about",
                file: "$audioInfo.file.url",
                poster: "$audioInfo.poster.url",
                category: "$audioInfo.category",
                owner: { name: "$owner.name", id: "$owner._id" },
                date: "$histories.date",
                progress: "$histories.progress",
            }
        }
    ])
    res.json(data)
}