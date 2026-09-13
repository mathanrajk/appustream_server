import { Model, model, Types, Schema } from "mongoose";
import { compare, hash } from "bcrypt";


interface ForgotPasswordLinkDocumation {
    owner: Types.ObjectId;
    token: string;
    createdAt: Date
}
interface Methods {
    compareToken(token: string): Promise<boolean>
}

const ForgotPasswordTokenSchema = new Schema<ForgotPasswordLinkDocumation, {}, Methods>({
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

ForgotPasswordTokenSchema.pre("save", async function () {
    if (this.isModified("token")) {
        this.token = await hash(this.token, 10);
    }
});
ForgotPasswordTokenSchema.methods.compareToken = async function (token) {
    const result = await compare(token, this.token)
    return result

}

export default model("ForgotPasswordToken", ForgotPasswordTokenSchema) as Model<ForgotPasswordLinkDocumation, {}, Methods>