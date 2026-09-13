import nodemailer from "nodemailer"
import { Mailer_Pass, Mailer_User,Mailer_mail,SIGN_IN_LINK} from "#/util/variable";
import path from "path";
import { generateToken } from "#/util/helper";
import emailValidationToken from "#/model/emailValidationToken";
import { generateTemplate } from "#/mail/template";

const generateMailTransporter = () => {
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: Mailer_User,
            pass: Mailer_Pass
        }
    });
    return transport

}
interface IProfile {
    name: string;
    emailId: string;
    userId: string
}

export const sendVerificationMail = async (token: string, profile: IProfile) => {
    const { name, emailId, userId } = profile;
    const transport = generateMailTransporter();
    const welcomeLines = [
        `Welcome aboard, ${name}! Let's tune in to your vibe and get your music taste dialed in. 🎧`,
        `Hey ${name}, glad you're here! Time to personalize your sound on AppuStream. 🎶`,
        `${name}, your playlist journey starts now. Let's set up your taste and hit play. 🎧✨`,
    ];
    const welcomeMessage = welcomeLines[Math.floor(Math.random() * welcomeLines.length)] as string;

    try {
        await transport.sendMail({
            from: Mailer_mail,
            to: emailId,
            subject: "Your AppuStream verification code is here 🎧",
            html: generateTemplate({
                title: `Welcome to AppuStream, ${name}! 🎧`,
                message: welcomeMessage,
                logo: "cid:logo",
                banner: "cid:welcome",
                link: "#",
                btnTitle: token,
            }),
            attachments: [
                { filename: "logo.png", path: path.join(__dirname, "../mail/logo.png"), cid: "logo" },
                { filename: "welcome.png", path: path.join(__dirname, "../mail/welcome.png"), cid: "welcome" },
            ],
        });
    } catch (error) {
        console.error("Failed to send verification email:", error);
        throw error;
    }
};

interface Options{
    email:string;
    link:string
}

export const sendForgotPasswordLink = async (options:Options) => {
    const { email, link} = options;
    const transport = generateMailTransporter();
const forgotPasswordLines = [
    `Hey , need a password reset? Let's get you back to your music on AppuStream. 🎵`,
    `Hi , we received a request to reset your password. No worries, we've got you covered! 🔒`,
    `let's get you a new password so you can get back to your playlists. 🎧✨`,
];

const forgotPasswordMessage = forgotPasswordLines[Math.floor(Math.random() * forgotPasswordLines.length)] as string;

    try {
        await transport.sendMail({
            from: Mailer_mail,
            to: email,
            subject: `Reset your AppuStream password link🎧`,
            html: generateTemplate({
                title: `Welcome to AppuStream! 🎧 Your daily soundtrack awaits; jump right in, or click Forgot password? if you need help logging in.`,
                message: forgotPasswordMessage,
                logo: "cid:logo",
                banner: "cid:forgot",
                link: link,
                btnTitle: "Rest Link",
            }),
            attachments: [
                { filename: "logo.png", path: path.join(__dirname, "../mail/logo.png"), cid: "logo" },
                { filename: "forget_password.png", path: path.join(__dirname, "../mail/forget_password.png"), cid: "forgot" },
            ],
        });
    } catch (error) {
        console.error("Failed to send verification email:", error);
        throw error;
    }
};

export const sentPasswordRestSuccessEmail = async (name:string, email:string) => {

    const transport = generateMailTransporter();
const resetSuccessLines = [
    `Hey {name}, your password has been successfully reset! Dive back into your music on AppuStream. 🎵`,
    `Hi {name}, your password reset was successful. Your account is secure and ready to go! 🔒`,
    `All set, {name}! Your new password is locked in. Time to get back to those playlists. 🎧✨`,
];

const resetSuccessMessage = resetSuccessLines[Math.floor(Math.random() * resetSuccessLines.length)] as string;

    try {
        await transport.sendMail({
            from: Mailer_mail,
            to: email,
            subject: `Password Reset Successful – Welcome back to AppuStream! 🎵`,
            html: generateTemplate({
                title: `Password Reset Successful! 🎧 Your daily soundtrack awaits; log in with your new password and jump right in.`,
                message: resetSuccessMessage,
                logo: "cid:logo",
                banner: "cid:forgot",
                link: SIGN_IN_LINK,
                btnTitle: "SIGN IN",
            }),
            attachments: [
                { filename: "logo.png", path: path.join(__dirname, "../mail/logo.png"), cid: "logo" },
                { filename: "forget_password.png", path: path.join(__dirname, "../mail/forget_password.png"), cid: "forgot" },
            ],
        });
    } catch (error) {
        console.error("Failed to send verification email:", error);
        throw error;
    }
};
