import { AudioDocument } from "#/model/audio";
import { Request } from "express";
import { ObjectId } from "mongoose";

export type populateFavList = AudioDocument<{ _id: ObjectId, name: string }>;

export interface createPlaylistRequest extends Request {
    body: {
        title: string;
        resId: string;
        visibility: "public" | "private"
    }

}
export interface updatePlaylistRequest extends Request {
    body: {
        title: string;
        id: string;
        item: string,
        visibility: "public" | "private"
    }

}