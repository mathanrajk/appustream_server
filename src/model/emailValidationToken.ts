import { Model, model, Types, Schema } from "mongoose";
import { compare, hash } from "bcrypt";


interface EmailVerificationDocumation {
    owner: Types.ObjectId;
    token: string;
    createdAt: Date
}
interface Methods {
    compareToken(token: string): Promise<boolean>
}

const emailVerificationTokenSchema = new Schema<EmailVerificationDocumation, {}, Methods>({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now()

    }
}, { timestamps: true });

emailVerificationTokenSchema.pre("save", async function () {
    if (this.isModified("token")) {
        this.token = await hash(this.token, 10);
    }
});
emailVerificationTokenSchema.methods.compareToken = async function (token) {
    const result = await compare(token, this.token)
    return result

}

export default model("EmailVerificationToken", emailVerificationTokenSchema) as Model<EmailVerificationDocumation, {}, Methods>