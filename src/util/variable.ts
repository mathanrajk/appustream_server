export const MONGO_URI = process.env.MONGO_URI as string
export const Mailer_User = process.env.Mailer_User as string
export const Mailer_Pass = process.env.Mailer_Pass as string
export const Mailer_mail = process.env.Mailer_mail as string
export const PASSWORD_RESET_LINK = process.env.PASSWORD_RESET_LINK as string
export const SIGN_IN_LINK = process.env.SIGN_IN_LINK as string
export const SIGN_IN_URL = process.env.SIGN_IN_URL as string
export const Cloud_Name = process.env.Cloud_Name as string
export const Cloud_Api_Key = process.env.Cloud_Api_Key as string
export const Cloud_Api_Secret = process.env.Cloud_Api_Secret as string
export const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim()
export const BREVO_SENDER_EMAIL =
  process.env.BREVO_SENDER_EMAIL?.trim() || process.env.Mailer_mail?.trim()
export const BREVO_SENDER_NAME =
  process.env.BREVO_SENDER_NAME?.trim() || "Tunexa"
// Optional: public https URL of the logo for emails (falls back to an inline copy)
export const EMAIL_LOGO_URL = process.env.EMAIL_LOGO_URL?.trim()
 