import { Schema, model } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
    },
    userImage: {
        type: String,
        default: "https://res.cloudinary.com/dayo1mpv0/image/upload/v1683686792/default/profile.jpg",
    },
    userPost: [{
        type: Schema.Types.ObjectId,
        ref: "Post",
    }],
    likedPost: [{
        Post: { type: Schema.Types.ObjectId, ref: 'Post' },
        liked: { type: Boolean, default: false },
    }],
    userSavedPost: [{
        type: Schema.Types.ObjectId,
        ref: "Post",
    }],
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: "Notification"
    }],
    following: {
        count: {
            type: Number,
            default: 0,
        },
        users: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }]
    },
    followers: {
        count: {
            type: Number,
            default: 0,
        },
        users: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }]
    },
},
    { timestamps: true }
);

const User = model("User", userSchema)

export default User;