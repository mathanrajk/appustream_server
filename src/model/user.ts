import { Model, model, ObjectId, Schema, Types } from "mongoose";
import { compare, hash } from "bcrypt";

export interface UserDocument {
    _id:Types.ObjectId;
    name: string;
    email: string;
    password: string;
    verified: boolean;
    avatar?: { url: string, publicId: string };
    tokens: string[];
    favorites: ObjectId[];
    followers: ObjectId[];
    followings: ObjectId[];
}
interface Methods{
    comparePassword(password:string):Promise<boolean>
}

const userSchem = new Schema<UserDocument,{},Methods>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: Object,
        url: String,
        publicId: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    favorites: [{
        type: Schema.Types.ObjectId
    }],
    followers: [{
        type: Schema.Types.ObjectId
    }],
    followings: [{
        type: Schema.Types.ObjectId
    }],
    tokens: [String]

}, { timestamps: true });

userSchem.pre("save",async function(){
    if (this.isModified("password")){
        this.password = await hash(this.password,10);

    }

})

userSchem.methods.comparePassword = async function (password) {
      const result = await compare(password, this.password)
    return result
    
}

export default model("user", userSchem) as Model<UserDocument,{},Methods>;