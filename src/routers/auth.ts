import { Router } from "express";
import { validate } from "#/middleware/validator";
import { CreateUserScheme, EmailVerificationBody, PasswordRestLink, SignInValidationSchema } from "#/util/validationSchema";
import { create, verifyEmail, sendReVerificationToken, generateForgetPasswordLink, grandValid, updatePassword, signin, updateProfile, sentProfile, logout } from "#/controllers/auth";
import { isValidPassRestToken, mustAuth } from "#/middleware/auth"
import fileParser from "#/middleware/fileParser";

const router = Router();
router.post("/create", validate(CreateUserScheme), create)
router.post("/verify-email", validate(EmailVerificationBody), verifyEmail)
router.post("/re-verify-email", sendReVerificationToken)
router.post("/forgot-password", generateForgetPasswordLink)
router.post("/verify-pass-reset-token", validate(EmailVerificationBody), isValidPassRestToken, grandValid)
router.post("/update-password", validate(PasswordRestLink), isValidPassRestToken, updatePassword)
router.post("/sign-in", validate(SignInValidationSchema), signin)
router.post("/is-auth",mustAuth, sentProfile);
router.post("/update-profile",mustAuth, fileParser,updateProfile)
router.post("/log-out",mustAuth,logout)



export default router