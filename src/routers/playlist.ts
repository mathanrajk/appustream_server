import { createPlaylist, getAudios, getPlaylistByProfile, removePlaylist, updatePlaylist } from "#/controllers/playlist";
import { isAuth, isVerified, mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { OldPlaylistValidationSchema, PlaylistValidationSchema } from "#/util/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/create", mustAuth, isVerified, validate(PlaylistValidationSchema), createPlaylist);
router.patch("/", mustAuth, isVerified, validate(OldPlaylistValidationSchema), updatePlaylist);
router.delete("/", mustAuth, removePlaylist);
router.get("/by-profile", mustAuth, getPlaylistByProfile);
router.get("/:playlistId", mustAuth, getAudios);


export default router;