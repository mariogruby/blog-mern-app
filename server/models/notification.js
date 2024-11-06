import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
    type: {
        type: String,
        enum: ['comment', 'like', 'follower'],
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    read: {
        type: Boolean,
        default: false,
    },
},
    { timestamps: true }
);

const Notification = model("Notification", notificationSchema);

export default Notification;