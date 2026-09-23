import forgotPasswordToken from "#/model/forgotPasswordToken";
import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import User from "#/model/user"
import { SIGN_IN_URL } from "#/util/variable";
import user from "#/model/user";
import { error } from "node:console";


export const isValidPassRestToken: RequestHandler = async (req, res, next) => {
    const { userId, token } = req.body;
    const resetToken = await forgotPasswordToken.findOne({ owner: userId });
    if (!resetToken) return res.status(403).json({ error: "unauthorized access,invalid token :)" });

    const matched = await resetToken.compareToken(token);
    if (!matched) return res.status(403).json({ error: "unauthorized access,invalid token :)" });
    next();
}

export const mustAuth: RequestHandler = async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization?.split("Bearer ")[1];
    if (!token) return res.status(403).json({ error: "Unauthorrized request :) " });
    const payload = verify(token, SIGN_IN_URL) as JwtPayload;
    const id = payload.userId;
    const user = await User.findOne({ _id: id, tokens: token })
    if (!user) return res.status(403).json({ error: "Unauthorrized request user :) " });
    req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        avatar: user.avatar?.url,
        followers: user.followers.length,
        followings: user.followings.length
    }

    req.token = token
    next();
}

export const isVerified: RequestHandler = async (req, res, next) => {
    if (!req.user?.verified) return res.status(403).json({ error: "Please verify your email account :)" })
    next();
}

export const isAuth: RequestHandler = async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization?.split("Bearer ")[1];
    if (token) {
        const payload = verify(token, SIGN_IN_URL) as JwtPayload;
        const id = payload.userId;
        const user = await User.findOne({ _id: id, tokens: token })
        if (!user) return res.status(403).json({ error: "Unauthorrized request user :) " });
        req.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            verified: user.verified,
            avatar: user.avatar?.url,
            followers: user.followers.length,
            followings: user.followings.length
        }

        req.token = token
    }

    next();
}