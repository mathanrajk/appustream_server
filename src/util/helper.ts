import { UserDocument } from "#/model/user";

export const generateToken = (length = 6) => {
    let opt = ""
    for (var i = 0; i <= length; i++) {
        const digtal = Math.floor(Math.random() * 10);
        opt += digtal;
    }
    return opt
}
export const currentday = () => {
  const now = new Date();

  const startOfDay = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0, 0, 0, 0
  ));

  const endOfDay = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    23, 59, 59, 999
  ));

  return { startOfDay, endOfDay };
};
export const formatProfile = (user: UserDocument) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        avatar: user.avatar?.url,
        followers: user.followers.length,
        followings: user.followings.length
    }

}