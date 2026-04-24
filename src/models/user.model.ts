import mongoose, { Document, Schema } from "mongoose"

export interface IUSER extends Document {
    _id: mongoose.Types.ObjectId
    firstname?: string
    lastname?: string
    email: string
    password: string
}

const userSchema = new Schema<IUSER>(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, unique: true, lowercase: true, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
)

export const User = mongoose.model<IUSER>("User", userSchema)
