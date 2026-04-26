import mongoose, { Document, Schema } from "mongoose"

export enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED"
}

export interface ITASK extends Document {
    _id: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    title: string
    description?: string
    status: TaskStatus
    createdAt: Date
    updatedAt: Date
}

const taskSchema = new Schema<ITASK>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: "",
            trim: true
        },
        status: {
            type: String,
            enum: Object.values(TaskStatus),
            default: TaskStatus.PENDING
        }
    },
    { timestamps: true }
)

export const Task = mongoose.model<ITASK>("Task", taskSchema)
