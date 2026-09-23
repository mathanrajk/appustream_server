import { createUser, verifyEmailRequest, RevalidateEmailRequest, ForgotPaasswordLinkRequest } from "#/@types/user";
import EmailValidationToken from "#/model/emailValidationToken";
import { PASSWORD_RESET_LINK, SIGN_IN_URL } from "#/util/variable"
import User from "#/model/user";
import { formatProfile, generateToken } from "#/util/helper";
import { sendForgotPasswordLink, sendVerificationMail, sentPasswordRestSuccessEmail } from "#/util/mail";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import crypto from "crypto"
import forgotPasswordToken from "#/model/forgotPasswordToken";
import * as jwt from "jsonwebtoken"
import formidable from "formidable";
import cloudinary from "#/cloude";
import { RequesWithFiles } from "#/middleware/fileParser";


export const create: RequestHandler = async (req: createUser, res) => {
    const { name, email, password } = req.body;
    const oldUser = await User.findOne({ email });
    if (oldUser) return res.status(403).json({ error: "Email is already in use" });
    const user = await User.create({ name, email, password });
    const token = generateToken();
    await EmailValidationToken.create({ owner: user._id, token });
    await sendVerificationMail(token, { name, emailId: email, userId: user._id.toString() })
    res.status(201).json({ user })
}

export const verifyEmail: RequestHandler = async (req: verifyEmailRequest, res) => {
    const { userId, token } = req.body;
    const verificationToken = await EmailValidationToken.findOne({
        owner: userId
    });
    if (!verificationToken) return res.status(403).json({ error: "Invalid token" })

    const match = await verificationToken.compareToken(token)
    if (!match) return res.status(403).json({ error: "Invalid token not matched " });

    await User.findByIdAndUpdate(userId, { verified: true });
    await EmailValidationToken.findByIdAndDelete(verificationToken._id);
    res.json({ message: "Your email is verified. " })

}

export const sendReVerificationToken: RequestHandler = async (req: RevalidateEmailRequest, res) => {
    const { userId } = req.body;
    if (!isValidObjectId(userId)) return res.status(404).json({ error: "Invalid userId :)" })
    const user = await User.findById(userId);
    if (!user) return res.status(403).json({ error: "Invaild user" })
    if (user.verified) return res.status(422).json({ error: "Your account is already verified :)" })
    await EmailValidationToken.findOneAndDelete({ owner: userId });
    const token = generateToken();
    await EmailValidationToken.create({
        owner: userId,
        token
    })
    await sendVerificationMail(token, { name: user.name, emailId: user.email, userId: user._id.toString() })
    res.status(201).json({ message: "re-send opt to your email !" })
}


export const generateForgetPasswordLink: RequestHandler = async (req: ForgotPaasswordLinkRequest, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(403).json({ error: "Account not found :)" });
    const token = crypto.randomBytes(36).toString("hex");
    await forgotPasswordToken.create({
        owner: user._id,
        token
    });
    const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`
    await sendForgotPasswordLink({ email, link: resetLink });
    res.json({ resetLink })
}

export const grandValid: RequestHandler = async (req, res) => {
    res.json({ vaild: true })
}
export const updatePassword: RequestHandler = async (req, res) => {
    const { userId, password } = req.body;
    const user = await User.findById(userId)
    if (!user) return res.status(403).json({ error: "Account not found :)" });

    const matched = await user.comparePassword(password);
    if (matched) return res.status(422).json({ error: "the new paassword must be different :)" });

    user.password = password;
    await user.save();

    await forgotPasswordToken.findOneAndDelete({ owner: userId });
    await sentPasswordRestSuccessEmail(user.name, user.email);
    res.json({ message: "Password rests successfully." })

}
export const signin: RequestHandler = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) return res.status(403).json({ error: "Email/Password mismatch :)" });

    const matched = await user.comparePassword(password);
    if (!matched) return res.status(403).json({ error: "Email/Password mismatch :)" });

    const token = jwt.sign({ userId: user._id }, SIGN_IN_URL);
    user.tokens.push(token);
    await user.save();
    res.json({
        profile: {
            id: user._id,
            name: user.name,
            email: user.email,
            verified: user.verified,
            avatar: user.avatar?.url,
            followers: user.followers,
            followings: user.followings
        },
        token
    })

}
export const updateProfile: RequestHandler = async (req: RequesWithFiles, res) => {
    const { name } = req.body;
    const avatar = req.files?.avatar as formidable.File;

    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ error: "user not found" });

    if (typeof name !== "string") return res.status(422).json({ error: "invalid name" });
    if (name.trim().length < 3) return res.status(422).json({ error: "invalid name" });

    user.name = name;

    if (avatar) {
        if (user.avatar?.publicId) {
            await cloudinary.uploader.destroy(user.avatar?.publicId);
        }
        const { secure_url, public_id } = await cloudinary.uploader.upload(avatar.filepath, {
            width: 300,
            height: 300,
            crop: "thumb",
            gravity: "face",
        });
        user.avatar = { url: secure_url, publicId: public_id };
    }

    await user.save();
    res.json({ profile: formatProfile(user) });
}
export const sentProfile: RequestHandler = async (req, res) => {
    res.json({ profile: req.user })
}
export const logout: RequestHandler = async (req, res) => {
    const { fromAll } = req.query;
    const token = req.token;
    const user = await User.findById(req.user?.id)
    if (!user) return res.status(422).json({ error: "user not found :)" })
    if (fromAll === "yes") user.tokens = [];
    else user.tokens = user.tokens.filter((tokenList) => tokenList !== token);
    await user.save();
    res.json({ success: true })

}
